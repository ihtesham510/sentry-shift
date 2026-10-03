use crate::config::Config;
use better_auth::{
    AuthConfig, BetterAuth,
    adapters::SqlxAdapter,
    plugins::{EmailPasswordPlugin, OrganizationPlugin, SessionManagementPlugin},
};
use sqlx::{Pool, Postgres};
use std::sync::Arc;

#[derive(Clone)]
pub struct Auth {
    pub _config: AuthConfig,
    pub better_auth: Arc<BetterAuth<SqlxAdapter>>,
}

impl Auth {
    pub async fn new(pool: &Pool<Postgres>, config: &Config) -> Self {
        let cors_url = config.cors_url.clone();

        let auth_config = AuthConfig::new(config.secret_key.clone())
            .base_path(config.base_url.clone())
            .trusted_origin(cors_url);

        let auth: BetterAuth<SqlxAdapter> = BetterAuth::<SqlxAdapter>::new(auth_config.clone())
            .database(SqlxAdapter::from_pool(pool.clone()))
            .plugin(EmailPasswordPlugin::new().enable_signup(true))
            .plugin(SessionManagementPlugin::new())
            .plugin(OrganizationPlugin::new())
            .build()
            .await
            .expect("Failed to build auth");

        Auth {
            _config: auth_config,
            better_auth: Arc::new(auth),
        }
    }
}
