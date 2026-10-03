use axum::Router;
use tower_http::services::{ServeDir, ServeFile};

use crate::state::AppState;

pub fn main_router() -> Router<AppState> {
    Router::<AppState>::new().fallback_service(
        ServeDir::new("web/dist").not_found_service(ServeFile::new("web/dist/index.html")),
    )
}
