const BaseHandler = require('./_baseHandler');
const {
    getJsonFromXlsx,
    getFileFromS3,
    getParseBody
} = require('../common/utils');
const { MANAGERS, JOB_STATUS } = require('../common/constant');

class ProcessFile extends BaseHandler {

    constructor() {
        super(true);
    }

    /** Validate body and filter empty rows */
    validateJson(jsonData) {
        return jsonData.filter(json => json.uid && json.platform);
    }

    /** Insert data in bulk */
    async insertBulkData(jsonData, ingestionId) {
        const deviceManager = this.dbManager.getManager(MANAGERS.DEVICE_IDS);
        let status = JOB_STATUS.COMPLETED;
        try {
            await deviceManager.bulkInsert(jsonData, ingestionId);
        } catch (er) {
            status = JOB_STATUS.FAILED;
        }
        return status;
    }

    /** update ingestion job id and status */
    async updateIngestionJobStatus(ingestionId, ingestionStatus) {
        const ingestionJobManager = this.dbManager.getManager(MANAGERS.INGESTION_JOB);
        await ingestionJobManager.updateStatus(ingestionId, ingestionStatus);
    }

    /**
     * This function will perform 6 steps
     * 1. Get parsed body
     * 2. Get file from s3
     * 3. convert csv to json
     * 4. validate json data only check for null value
     * 5. insert json into body
     * 6. update ingestion job status
     */
    async process(event, context, callback) {
        const { ingestionId, s3Key } = getParseBody(event);
        const csvFile = await getFileFromS3(s3Key);
        const jsonData = await getJsonFromXlsx(csvFile);
        const filterData = this.validateJson(jsonData);
        console.log(jsonData.length, filterData.length);
        const ingestionStatus = await this.insertBulkData(filterData, ingestionId);
        await this.updateIngestionJobStatus(ingestionId, ingestionStatus);
    }

}

exports.main = async (event, context, callback) => {
    return await new ProcessFile().handler(event, context, callback);
}