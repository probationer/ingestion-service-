const BaseManager = require('./_baseManager');
const { uuid } = require('uuidv4');
const { JOB_STATUS } = require('../common/constant');

class IngestionJob extends BaseManager {

    generateIngestionUniqueId() {
        return uuid();
    }

    /** Create new job */
    async createJob(s3key, owner) {
        const ingestionId = this.generateIngestionUniqueId();
        const response = await this.connection.query(
            `INSERT INTO ingestion_jobs (ingestion_id, s3_key, owner_id, status) 
            VALUES ('${ingestionId}','${s3key}','${owner}','${JOB_STATUS.PENDING}')`
        );
        if (response.insertId) {
            return ingestionId
        }
        throw Error('Not Able to ingest data');
    }

    async updateStatus(ingestionId, status) {
        const response = await this.connection.query(
            `UPDATE ingestion_jobs SET status = '${status}' WHERE ingestion_id = '${ingestionId}'`
        );
        console.log(response);

    }
}

module.exports = IngestionJob;