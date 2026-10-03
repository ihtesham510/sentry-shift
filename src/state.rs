use crate::{auth::Auth, config::Config, cron::AppCron, db::Db, s3::S3};
use sqlx::{Pool, Postgres};
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub pg_pool: Arc<Pool<Postgres>>,
    pub config: Arc<Config>,
    pub auth: Arc<Auth>,
    pub cron: Arc<AppCron>,
    pub s3: Arc<S3>,
}
impl AppState {
    pub async fn new() -> Self {
        let config = Arc::new(Config::from_env().unwrap());
        let pg_pool = Arc::new(Db::init(&config.database_url).await.unwrap());
        let auth = Arc::new(Auth::new(&pg_pool, &config).await);
        let cron = Arc::new(AppCron::init(&pg_pool).await.unwrap());
        let s3 = Arc::new(S3::init(&config));
        AppState {
            pg_pool,
            config,
            auth,
            cron,
            s3,
        }
    }
}
