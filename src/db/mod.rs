use sqlx::{Pool, Postgres, postgres::PgPoolOptions};
use tracing::{error, info};

pub struct Db {
    _pool: Pool<Postgres>,
}

impl Db {
    pub async fn init(database_url: &str) -> Result<Pool<Postgres>, sqlx::Error> {
        let _conn = match PgPoolOptions::new()
            .max_connections(5)
            .connect(database_url)
            .await
        {
            Ok(val) => {
                info!("Connected to the database  ✅️");
                val
            }
            Err(_e) => {
                error!("Error while connecting to the database ❌️ {}", _e);
                return Err(_e.into());
            }
        };

        match sqlx::migrate!("./src/db/migrations").run(&_conn).await {
            Ok(_) => info!("Migration ran successfully. ✅️"),
            Err(_e) => {
                error!("Error while running Migrations ❌️");
                return Err(_e.into());
            }
        };

        Ok(_conn)
    }
}
