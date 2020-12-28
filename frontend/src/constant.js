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
    REGION: 'ap-south-1',
    BASE_URL: 'https://s4vv9yjay7.execute-api.ap-southeast-1.amazonaws.com/dev/',
    GET_PRESIGNED_URL: 'uploadUrl',
    INGESTION_BY_ID: 'ingestion/{id}',
    INGESTION: 'ingestion',
    DEVICES_BY_INGESTION_ID: 'uids/{id}'
})