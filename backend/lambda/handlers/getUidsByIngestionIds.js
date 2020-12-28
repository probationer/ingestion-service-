const BaseHandler = require('./_baseHandler');
const ResponseHandler = require('./_responseHandler');

const { MANAGERS } = require('../common/constant');

class GetUidsByIngestionId extends BaseHandler {

    constructor() {
        super(true);
    }

    getIngestionDetails(ingestionId) {
        const ingestionManager = this.dbManager.getManager(MANAGERS.DEVICE_IDS);
        return ingestionManager.getDeviceIdsByIngestionId(ingestionId, 100);
    }

    async process(event, context, callback) {
        const ingestionId = event.pathParameters ? event.pathParameters.id : null;

        if (ingestionId) {
            const ingestionDetails = await this.getIngestionDetails(ingestionId);
            return ResponseHandler.callbackRespondWithJsonBody(200, ingestionDetails)
        }
    }

}

exports.main = async (event, context, callback) => {
    return await new GetUidsByIngestionId().handler(event, context, callback);
}