const BaseHandler = require('./_baseHandler');
const ResponseHandler = require('./_responseHandler');

const { MANAGERS, UPLOAD_FOLDER } = require('../common/constant');

class GetIngestionJobs extends BaseHandler {

    constructor() {
        super(true);
    }

    async getIngestionDetails() {
        const ingestionManager = this.dbManager.getManager(MANAGERS.INGESTION_JOB);
        const response = await ingestionManager.getIngestionJob();
        return response.map(row => {
            row.s3_key = row.s3_key.replace(UPLOAD_FOLDER, '');
            return row;
        })
    }

    async process(event, context, callback) {
        const ingestionDetails = await this.getIngestionDetails();
        return ResponseHandler.callbackRespondWithJsonBody(200, ingestionDetails)
    }

}

exports.main = async (event, context, callback) => {
    return await new GetIngestionJobs().handler(event, context, callback);
}