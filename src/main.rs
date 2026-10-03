use crate::{routes::router, state::AppState, tracing::init_tracing};
use ::tracing::{error, info};
use axum::serve::serve;
use std::error::Error;
use tokio::net::TcpListener;

mod auth;
mod config;
mod cron;
mod db;
mod error;
mod handlers;
mod middlewares;
mod routes;
mod s3;
mod state;
mod tracing;
mod types;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    init_tracing();
    let state = AppState::new().await;
    let address = format!("0.0.0.0:{}", state.config.port);
    let listener = TcpListener::bind(address).await.unwrap();

    info!("Server Running on port {}", state.config.port);

    let (server, cron) = tokio::join!(serve(listener, router(&state)), state.cron.start());

    if let Err(_err) = server {
        error!("Error while starting server {:?}", _err);
    }
    if let Err(_err) = cron {
        error!("Error while starting cron scheduler {:?}", _err);
    }

    Ok(())
}
