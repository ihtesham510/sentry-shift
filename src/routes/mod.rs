use crate::{
    middlewares::logger::logger,
    routes::{api::api_router, auth::auth_router, main::main_router},
    state::AppState,
};
use axum::{Router, middleware};

mod api;
mod auth;
mod main;

pub fn router(state: &AppState) -> Router {
    Router::new()
        .merge(main_router())
        .nest("/api", api_router(state))
        .nest("/api/auth", auth_router(state))
        .with_state(state.clone())
        .layer(middleware::from_fn(logger))
}
