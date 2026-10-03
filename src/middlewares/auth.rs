use axum::{
    extract::{Request, State},
    middleware::Next,
    response::Response,
};

use crate::{error::AppError, state::AppState};
use axum_extra::extract::CookieJar;

pub async fn auth_middleware(
    State(state): State<AppState>,
    cookie: CookieJar,
    req: Request,
    next: Next,
) -> Result<Response, AppError> {
    let session_cookie = cookie.get("better-auth.session_token");
    if let Some(cookie) = session_cookie {
        let token = cookie.value();
        if let Some(_session) = state
            .auth
            .better_auth
            .session_manager()
            .get_session(token)
            .await?
        {
            let res = next.run(req).await;
            return Ok(res);
        }
    }

    Err(AppError::UnAuthorized)
}
