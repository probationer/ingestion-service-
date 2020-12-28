module.exports = Object.freeze({
    MANAGERS: {
        INGESTION_JOB: 'ingestion_manager',
        DEVICE_IDS: 'device_ids'
    },
    JOB_STATUS: {
        PENDING: 'pending',
        COMPLETED: 'completed',
        FAILED: 'failed',
    },
    INGESTION_BUCKET: 'ingestion-service-dev-2',
    TABLE: {
        INGESTION_JOBS: 'ingestion_jobs',
        DEVICE_IDS: 'device_ids',
    },
    DB_SECRETS: {
        host: "Required",
        database: "Required",
        user: "Required",
        password: "Required"
    }
})