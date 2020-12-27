const IngestionJobManager = require('./ingestionJobsManager');
const DeviceIdsManager = require('./deviceIdsManager');
const { MANAGERS } = require('../common/constant');

class ManagerFatory {
    constructor(connection) {
        this.connection = connection;
    }

    getManager(manager) {
        switch (manager) {
            case MANAGERS.INGESTION_JOB:
                return new IngestionJobManager(this.connection);
                break;
            case MANAGERS.DEVICE_IDS:
                return new DeviceIdsManager(this.connection);
                break;
            default:
                console.log('Invalid manager request');

        }
    }
}


module.exports = ManagerFatory;