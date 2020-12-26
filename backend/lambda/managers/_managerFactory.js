const IngestionJobManager = require('./ingestionJobsManager');
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
            default:
                console.log('Invalid manager request');

        }
    }
}


module.exports = ManagerFatory;