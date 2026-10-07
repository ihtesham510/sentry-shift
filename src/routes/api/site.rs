use axum::Router;
use axum::routing::{delete, get, post};

use crate::handlers::site::{
    add_site, add_site_image, delete_site, get_site, get_site_pictures, get_sites, get_upload_url,
};
use crate::state::AppState;

pub fn site_router() -> Router<AppState> {
    Router::new()
        .route("/", get(get_sites))
        .route("/{id}", delete(delete_site))
        .route("/", post(add_site))
        .route("/{id}", get(get_site))
        .route("/{id}/images", get(get_site_pictures))
        .route("/upload", post(get_upload_url))
        .route("/image", post(add_site_image))
}
