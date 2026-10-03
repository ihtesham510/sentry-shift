use std::time::Duration;

use aws_config::{BehaviorVersion, Region};
use aws_sdk_s3::config::Credentials;
use aws_sdk_s3::presigning::PresigningConfig;
use aws_sdk_s3::{Client, Config};

use crate::config::Config as AppConfig;
pub struct S3 {
    client: Client,
    bucket: String,
}

impl S3 {
    pub fn init(app_config: &AppConfig) -> Self {
        let creds = Credentials::new(
            app_config.rust_fs_access_key.clone(),
            app_config.rust_fs_secret_key.clone(),
            None,
            None,
            "rustfs",
        );
        let config = Config::builder()
            .behavior_version(BehaviorVersion::latest())
            .region(Region::new("us-east-1"))
            .endpoint_url(app_config.rust_fs_url.clone())
            .credentials_provider(creds)
            .force_path_style(true)
            .build();
        let client = Client::from_conf(config);
        S3 {
            client,
            bucket: app_config.rust_fs_bucket.clone(),
        }
    }
    pub async fn get_upload_url(&self, key: String) -> Result<String, anyhow::Error> {
        let presigned = self
            .client
            .put_object()
            .bucket(self.bucket.clone())
            .key(key)
            .presigned(PresigningConfig::expires_in(Duration::from_secs(300)).unwrap())
            .await?;
        Ok(presigned.uri().to_string())
    }
    pub async fn get_presigned_url(&self, key: String) -> Result<String, anyhow::Error> {
        let presigned = self
            .client
            .get_object()
            .bucket(self.bucket.clone())
            .key(key)
            .presigned(PresigningConfig::expires_in(Duration::from_secs(300)).unwrap())
            .await?;
        Ok(presigned.uri().to_string())
    }
}
