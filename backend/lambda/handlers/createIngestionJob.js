const AWS = require('aws-sdk');

const BaseHandler = require('./_baseHandler');
const ReponseHandler = require('./_responseHandler');

const { getParseBody } = require('../common/utils');

const { MANAGERS } = require('../common/constant');

class CreateIngestionJob extends BaseHandler {

    constructor() {
        super(true);
    }

    /**
     * Ingestion job in table with pending status
     * @param {*} body 
     */
    createIngestionJobWithPending(body) {
        const { s3Key, owner } = body;
        return this.ingestionManager.createJob(s3Key, owner);
    }

    /**
     * Invoke async lambda to start process on ingested file
     * @param {*} ingestionJobId 
     * NOTE: Async lambda will note wait for reponse 
     */
    async ingestSheet(ingestionId, s3Key) {
        const body = { ingestionId, s3Key }
        const lambda = new AWS.Lambda();
        const params = {
            FunctionName: `arn:aws:lambda:${process.env.REGION}:${process.env.AWS_ACCOUNT_ID}:function:ingestion-service-${process.env.STAGE}-processFile`,
            InvocationType: 'Event',
            Payload: JSON.stringify(body)
        };
        return await lambda.invoke(params).promise();
    }

    /**
     * Ingestion job 
     * 1. parse body
     * 2. put a new job in table 
     * 3. get new ingestion id
     */
    async process(event, context, callback) {
        let body = event.body;
        if (body) {
            this.ingestionManager = this.dbManager.getManager(MANAGERS.INGESTION_JOB);
            body = getParseBody(body);
            const ingestionJobId = await this.createIngestionJobWithPending(body);
            // Ingestion sheet trigger another async lambda which will not wait for reponse
            await this.ingestSheet(ingestionJobId, body.s3Key);
            return ReponseHandler.callbackRespondWithJsonBody(200, { ingestionJobId });
        }
        throw Error('Body not found');
    }

}

exports.main = async (event, context, callback) => {
    return await new CreateIngestionJob().handler(event, context, callback);
}