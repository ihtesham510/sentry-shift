use axum::{
    Json,
    body::Body,
    extract::{Path, State},
    http::StatusCode,
    response::Response,
};
use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::{error::AppError, state::AppState, types::*};
pub async fn get_sites(State(state): State<AppState>) -> Result<Json<Vec<Site>>, AppError> {
    let AppState { pg_pool, .. } = state;
    let sites = sqlx::query_as!(
        Site,
        r#"
    SELECT
        id, organization_id, address_id, name,
        client_name, client_email, phone_no,
        created_at, updated_at
    FROM "site"
    "#
    )
    .fetch_all(pg_pool.as_ref())
    .await?;

    Ok(Json(sites))
}

pub async fn get_site(Path(id): Path<i32>) -> Response {
    Response::builder()
        .status(StatusCode::OK)
        .body(Body::new(serde_json::json!({ "id":id }).to_string()))
        .unwrap()
}

pub async fn add_site(
    State(state): State<AppState>,
    Json(new_site): Json<InsertSite>,
) -> Result<Json<Site>, AppError> {
    let AppState { pg_pool, .. } = state;

    let mut tx = pg_pool.begin().await?;

    let organization_id = sqlx::query!(
        "SELECT (id) FROM organization WHERE id = $1 LIMIT 1",
        new_site.organization_id
    )
    .fetch_optional(&mut *tx)
    .await?;

    if organization_id.is_none() {
        return Err(AppError::NotFound(Some(
            "Organization not found".to_string(),
        )));
    }

    let address_id = sqlx::query!(
        r#"
    INSERT INTO address ( 
        address_line_1, address_line_2, city, state,
        country, zip
        )
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING (id);
    "#,
        new_site.address.address_line_1,
        new_site.address.address_line_2,
        new_site.address.city,
        new_site.address.state,
        new_site.address.country,
        new_site.address.zip,
    )
    .fetch_one(&mut *tx)
    .await?
    .id;

    let created_site = sqlx::query_as!(
        Site,
        r#"
    INSERT INTO site (organization_id, address_id, name, client_name, client_email, phone_no)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
        id as "id!",
        organization_id as "organization_id!",
        address_id as "address_id!",
        name as "name!",
        client_name as "client_name!",
        client_email as "client_email!",
        phone_no as "phone_no!",
        created_at as "created_at!",
        updated_at as "updated_at!" "#,
        new_site.organization_id,
        address_id,
        new_site.name,
        new_site.client_name,
        new_site.client_email,
        new_site.phone_no
    )
    .fetch_one(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(Json(created_site))
}

pub async fn delete_site(
    Path(id): Path<i32>,
    State(state): State<AppState>,
) -> Result<(), AppError> {
    sqlx::query!("delete from site where id = $1", id)
        .execute(state.pg_pool.as_ref())
        .await?;
    Ok(())
}

pub async fn get_upload_url(
    State(state): State<AppState>,
    Json(body): Json<UploadReq>,
) -> Result<Json<String>, AppError> {
    let UploadReq { file_name } = body;

    let file_id = Uuid::new_v4();
    let date: DateTime<Utc> = Utc::now();
    let key = format!("{file_id}-{date}-{file_name}");
    let url = state.s3.get_upload_url(key).await?;
    Ok(Json(url))
}

pub async fn add_site_image(
    State(state): State<AppState>,
    Json(body): Json<UploadSiteImageReq>,
) -> Result<Json<i32>, AppError> {
    let AppState { pg_pool, .. } = state;
    let created_site = sqlx::query!(
        r#"
        INSERT INTO site_picture (key, site_id)
        VALUES ($1, $2) RETURNING id as "id!"
        "#,
        body.key,
        body.site_id
    )
    .fetch_one(pg_pool.as_ref())
    .await?;
    Ok(Json(created_site.id))
}

pub async fn get_site_pictures(
    Path(id): Path<i32>,
    State(state): State<AppState>,
) -> Result<Json<Vec<serde_json::Value>>, AppError> {
    let AppState { pg_pool, s3, .. } = state;

    let query = sqlx::query_as!(
        SitePicture,
        r#"
        SELECT * FROM site_picture WHERE site_id = $1;
        "#,
        id
    )
    .fetch_all(pg_pool.as_ref())
    .await?;

    let _pictures = query.iter().map(|val| {
        let s3_client = s3.clone();
        async move {
            let mut picture: serde_json::Value = serde_json::to_value(&val).unwrap();
            let url = s3_client.get_presigned_url(val.key.clone()).await.unwrap();

            if let Some(obj) = picture.as_object_mut() {
                obj.insert("url".to_string(), serde_json::Value::String(url));
            }

            picture
        }
    });
    let pictures = futures::future::join_all(_pictures).await;

    Ok(Json(pictures))
}
