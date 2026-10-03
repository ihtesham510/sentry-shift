use tracing_subscriber::registry;
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

pub fn init_tracing() {
    registry()
        .with(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,sqlx=warn,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();
}
