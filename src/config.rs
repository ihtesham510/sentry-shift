use std::env::{VarError, var};

pub struct Config {
    pub database_url: String,
    pub port: u16,
    pub base_url: String,
    pub cors_url: String,
    pub secret_key: String,
    pub rust_fs_url: String,
    pub rust_fs_access_key: String,
    pub rust_fs_secret_key: String,
    pub rust_fs_bucket: String,
}

impl Config {
    pub fn from_env() -> Result<Self, VarError> {
        dotenvy::dotenv().ok();

        let database_url: String = var("DATABASE_URL").expect("Database Url is required");
        let base_url: String = var("BASE_URL").expect("Base Url is required");
        let cors_url: String = var("CORS_URL").expect("CORS Url is required");
        let secret_key: String = var("SECRET_KEY").expect("SECRET_KEY is required");

        let rust_fs_url: String = var("RUSTFS_SECRET_URL").expect("RUSTFS_SECRET_URL is required");
        let rust_fs_access_key: String =
            var("RUSTFS_ACCESS_KEY").expect("RUSTFS_ACCESS_KEY is required");
        let rust_fs_secret_key: String =
            var("RUSTFS_SECRET_KEY").expect("RUSTFS_SECRET_KEY is required");

        let rust_fs_bucket: String = var("RUSTFS_BUCKET").expect("RUSTFS_BUCKET is required");

        let port = var("PORT")
            .unwrap_or_else(|_| "3000".to_string())
            .parse::<u16>()
            .unwrap_or_else(|_| 3000);

        Ok(Config {
            database_url,
            port,
            base_url,
            cors_url,
            secret_key,
            rust_fs_url,
            rust_fs_access_key,
            rust_fs_secret_key,
            rust_fs_bucket,
        })
    }
}
