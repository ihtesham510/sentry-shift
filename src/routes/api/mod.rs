use axum::{Router, middleware};

use crate::{middlewares::auth::auth_middleware, routes::api::site::site_router, state::AppState};

mod site;

pub fn api_router(state: &AppState) -> Router<AppState> {
    Router::new()
        .nest("/site", site_router())
        .layer(middleware::from_fn_with_state(
            state.clone(),
            auth_middleware,
        ))
}
