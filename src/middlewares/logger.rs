use std::time::Instant;

use axum::{body::Body, extract::Request, middleware::Next, response::Response};
use tracing::info;

pub async fn logger(request: Request, next: Next) -> Response<Body> {
    let time = Instant::now();
    let uri = request.uri().clone();
    let method = request.method().clone();
    info!("{} -> {}", method, uri);
    let response = next.run(request).await;
    let duration = time.elapsed();
    info!(
        "{} <- {} {} took {} ms",
        method,
        uri,
        response.status(),
        duration.as_millis()
    );
    response
}
