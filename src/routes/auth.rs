use axum::Router;
use better_auth::AxumIntegration;

use crate::state::AppState;

pub fn auth_router(state: &AppState) -> Router<AppState> {
    let auth_router = state
        .auth
        .better_auth
        .clone()
        .axum_router()
        .with_state(state.auth.better_auth.clone());

    Router::new().merge(auth_router).with_state(state.clone())
}
