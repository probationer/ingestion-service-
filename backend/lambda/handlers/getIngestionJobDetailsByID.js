const BaseHandler = require('./_baseHandler');
const ResponseHandler = require('./_responseHandler');

const { MANAGERS, UPLOAD_FOLDER } = require('../common/constant');

class GetJobDetailsById extends BaseHandler {

    constructor() {
        super(true);
    }

    async getIngestionDetailsById(ingestionId) {
        const ingestionManager = this.dbManager.getManager(MANAGERS.INGESTION_JOB);
        const resp = await ingestionManager.getIngestionJobById(ingestionId);
        if (resp) {
            resp.s3_key = resp.s3_key.replace(UPLOAD_FOLDER, '');
        }
        return resp;
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