use axum::{
    body::Body,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use better_auth::AuthError;
use tracing::error;

#[derive(Debug)]
pub enum AppError {
    NotFound(Option<String>),
    NotAllowed,
    UnAuthorized,
    InvalidArgument(String),
    Db(sqlx::Error),
    BadRequest(String),
    Internal(Option<anyhow::Error>),
    RateLimited,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match &self {
            AppError::NotFound(_msg) => (
                StatusCode::NOT_FOUND,
                if let Some(msg) = _msg {
                    msg.to_owned().to_string()
                } else {
                    "Row not found".to_string()
                },
            ),
            AppError::NotAllowed => (StatusCode::NOT_ACCEPTABLE, "Sorry, Not Allowed".to_string()),
            AppError::UnAuthorized => (
                StatusCode::UNAUTHORIZED,
                "Sorry, you are UnAuthorized".to_string(),
            ),
            AppError::InvalidArgument(arg) => (
                StatusCode::BAD_REQUEST,
                format!("Invalid Arguments {:?}", arg).to_string(),
            ),
            AppError::Db(_err) => {
                error!("Database Error {:?}", _err);

                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    format!("Database Error Occured {:?} ", _err).to_string(),
                )
            }
            AppError::BadRequest(_req) => (
                StatusCode::BAD_REQUEST,
                format!("Sorry, Bad Request {:?}", _req).to_string(),
            ),
            AppError::Internal(e) => {
                error!("Internal Error Occured {:?}", e);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    format!("Internal Error Occured {:?} ", e).to_string(),
                )
            }
            AppError::RateLimited => (
                StatusCode::TOO_MANY_REQUESTS,
                "You have reached your rate limit, try again after few minutes".to_string(),
            ),
        };
        Response::builder()
            .status(status)
            .body(Body::new(
                serde_json::json!({
                    "error":message
                })
                .to_string(),
            ))
            .unwrap()
    }
}

impl From<sqlx::Error> for AppError {
    fn from(e: sqlx::Error) -> Self {
        match e {
            sqlx::Error::RowNotFound => AppError::NotFound(None),
            sqlx::Error::InvalidArgument(arg) => AppError::InvalidArgument(arg),
            other => AppError::Db(other),
        }
    }
}
impl From<anyhow::Error> for AppError {
    fn from(err: anyhow::Error) -> Self {
        AppError::Internal(Some(err))
    }
}

impl From<AuthError> for AppError {
    fn from(err: AuthError) -> Self {
        match err {
            AuthError::Unauthorized => AppError::UnAuthorized,
            AuthError::RateLimited => AppError::RateLimited,
            _ => AppError::Internal(None),
        }
    }
}
