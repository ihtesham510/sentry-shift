use std::sync::Arc;

use sqlx::{Pool, Postgres};
use tokio_cron_scheduler::{JobScheduler, JobSchedulerError};

pub struct AppCron {
    schedular: Arc<JobScheduler>,
}

impl AppCron {
    pub async fn init(pool: &Pool<Postgres>) -> Result<Self, JobSchedulerError> {
        let schedular = JobScheduler::new().await.unwrap();
        Ok(AppCron {
            schedular: Arc::new(schedular),
        })
    }
    pub async fn start(&self) -> Result<(), JobSchedulerError> {
        self.schedular
            .start()
            .await
            .expect("Error while running scheduler");
        Ok(())
    }
}
