const { uuid } = require('uuidv4');
const BaseHandler = require('./_baseHandler');
const ResponseHandler = require('./_responseHandler');
const AWS = require('aws-sdk');
const { INGESTION_BUCKET } = require('../common/constant');


const s3 = new AWS.S3({
    region: 'ap-south-1',
    accessKeyId: 'AKIAWD7W7BXEX4I5TCDB',
    secretAccessKey: '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'
});
class GetPreSignedUrl extends BaseHandler {

    constructor() {
        super(true);
    }

    getPreSignedUrlAndKey() {
        const signedUrlExpireSeconds = 60 * 5;
        const key = `userCsv/${uuid()}.csv`;
        const url = s3.getSignedUrl('putObject', {
            Bucket: INGESTION_BUCKET,
            Key: key,
            Expires: signedUrlExpireSeconds,
            ContentType: 'text/csv'
        })
        console.log(url);
        return { url, key };
    }

    async process(event, context, callback) {
        const preSignedUrlAndKey = this.getPreSignedUrlAndKey();
        return ResponseHandler.callbackRespondWithJsonBody(200, preSignedUrlAndKey)
    }

}

exports.main = async (event, context, callback) => {
    return await new GetPreSignedUrl().handler(event, context, callback);
}