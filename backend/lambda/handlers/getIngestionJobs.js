const BaseHandler = require('./_baseHandler');
const ResponseHandler = require('./_responseHandler');

const { MANAGERS } = require('../common/constant');

class GetIngestionJobs extends BaseHandler {

    constructor() {
        super(true);
    }

    getIngestionDetails() {
        const ingestionManager = this.dbManager.getManager(MANAGERS.INGESTION_JOB);
        return ingestionManager.getIngestionJob();
    }

    async process(event, context, callback) {
        const ingestionDetails = await this.getIngestionDetails();
        return ResponseHandler.callbackRespondWithJsonBody(200, ingestionDetails)
    }

}

exports.main = async (event, context, callback) => {
    return await new GetIngestionJobs().handler(event, context, callback);
}