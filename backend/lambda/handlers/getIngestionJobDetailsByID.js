const BaseHandler = require('./_baseHandler');
const ResponseHandler = require('./_responseHandler');

const {
    getJsonFromXlsx,
    getFileFromS3,
    getParseBody
} = require('../common/utils');
const { MANAGERS, JOB_STATUS } = require('../common/constant');

class GetJobDetailsById extends BaseHandler {

    constructor() {
        super(true);
    }

    getIngestionDetailsById(ingestionId) {
        const ingestionManager = this.dbManager.getManager(MANAGERS.INGESTION_JOB);
        return ingestionManager.getIngestionJobById(ingestionId);
    }

    async process(event, context, callback) {
        const ingestionId = event.pathParameters ? event.pathParameters.id : null;

        if (ingestionId) {
            const ingestionDetails = await this.getIngestionDetailsById(ingestionId);
            return ResponseHandler.callbackRespondWithJsonBody(200, ingestionDetails)
        }
        throw Error('Invalid input');
    }

}

exports.main = async (event, context, callback) => {
    return await new GetJobDetailsById().handler(event, context, callback);
}