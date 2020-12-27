const BaseHandler = require('./_baseHandler');
const ResponseHandler = require('./_responseHandler');
const AWS = require('aws-sdk');
const { MANAGERS, INGESTION_BUCKET } = require('../common/constant');


const s3 = new AWS.S3();
class GetPreSignedUrl extends BaseHandler {

    constructor() {
        super(true);
    }

    getPreSignedUrl() {
        const signedUrlExpireSeconds = 60 * 5

        const url = s3.getSignedUrl('getObject', {
            Bucket: INGESTION_BUCKET,
            Key: 'abc.xlsx',
            Expires: signedUrlExpireSeconds
        })
        return url;
    }

    async process(event, context, callback) {
        const preSignedUrl = this.getPreSignedUrl();
        return ResponseHandler.callbackRespondWithJsonBody(200, { preSignedUrl })
    }

}

exports.main = async (event, context, callback) => {
    return await new GetPreSignedUrl().handler(event, context, callback);
}