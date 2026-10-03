use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

#[derive(Clone, Serialize, Deserialize, FromRow)]
pub struct Site {
    #[serde(skip_deserializing)]
    pub id: i32,
    pub organization_id: String,
    pub address_id: i32,
    pub name: String,
    pub client_name: String,
    pub client_email: String,
    pub phone_no: String,
    #[serde(skip_deserializing)]
    pub created_at: DateTime<Utc>,
    #[serde(skip_deserializing)]
    pub updated_at: DateTime<Utc>,
}

#[derive(Clone, Serialize, Deserialize, FromRow)]
pub struct Address {
    #[serde(skip_deserializing)]
    pub id: i32,
    pub address_line_1: String,
    pub address_line_2: Option<String>,
    pub state: String,
    pub city: String,
    pub zip: String,
    pub country: String,
    #[serde(skip_deserializing)]
    pub created_at: DateTime<Utc>,
    #[serde(skip_deserializing)]
    pub updated_at: DateTime<Utc>,
}

#[derive(Clone, Serialize, Deserialize, FromRow)]
pub struct InsertSite {
    #[serde(skip_deserializing)]
    pub id: i32,
    pub organization_id: String,
    pub address: Address,
    pub name: String,
    pub client_name: String,
    pub client_email: String,
    pub phone_no: String,
    #[serde(skip_deserializing)]
    pub created_at: DateTime<Utc>,
    #[serde(skip_deserializing)]
    pub updated_at: DateTime<Utc>,
}

#[derive(Clone, Serialize, Deserialize, FromRow)]
pub struct SitePicture {
    pub id: i32,
    pub key: String,
    pub site_id: i32,
    #[serde(skip_deserializing)]
    pub created_at: DateTime<Utc>,
    #[serde(skip_deserializing)]
    pub updated_at: DateTime<Utc>,
}

#[derive(Clone, Deserialize)]
pub struct UploadReq {
    pub file_name: String,
}

#[derive(Clone, Deserialize)]
pub struct UploadSiteImageReq {
    pub key: String,
    pub site_id: i32,
}

#[derive(Serialize)]
pub struct WithExtra<T, E> {
    #[serde(flatten)]
    pub inner: T,
    #[serde(flatten)]
    pub extra: E,
}
