const AWS = require('aws-sdk');
const PromisePool = require('@supercharge/promise-pool')
const csv = require('csvtojson');

const { INGESTION_BUCKET } = require('../common/constant');
const s3 = new AWS.S3();
const secretsmanager = new AWS.SecretsManager()
/**
 * Create a new promise pool instance which then allows chain
 * the .for(), .withConcurrency(), and .process() methods.
 * The .process() method is an async function starting the
 * actual processing.
 *
 * The return values for the promise pool is an object containing
 * two properties: results and errors
 * @param {*} promiseArray
 * @param {*} callback
 * @param {*} batchSize
 */
exports.promisePool = async (promiseArray, callback, batchSize = 10) => {

    const { results, errors } = await PromisePool
        .for(promiseArray)
        .withConcurrency(batchSize)
        .process(callback);

    const errorItems = errors.map(err => err.item);
    return { completedPromises: results, failedPromises: errorItems };
}

/** parse input body */
exports.getParseBody = (body) => {
    try {
        body = JSON.parse(body);
    } catch (er) {
        console.error('Error on parse', JSON.stringify(er));
    }
    return body;
}


/** Convert  */
exports.getJsonFromCsv = (stream) => {
    try {
        return csv().fromStream(stream);
    } catch (er) {
        throw Error('Parse Error');
    }
}



/**
 *  params = {
         Bucket: `multiply-uploads-prod`,
         Key: `folderName/key`
    };
 * @param {*} s3Key 
 */
exports.getFileFromS3 = async (s3Key) => {
    const params = {
        Bucket: INGESTION_BUCKET,
        Key: s3Key
    }
    return s3.getObject(params).createReadStream();
}

/** Get secret from */
exports.getSecret = async (secretName) => {
    const params = {
        SecretId: secretName
    };
    let secrets = await secretsmanager.getSecretValue(params).promise();
    if (!secrets) {
        throw Error('Unable to find messageapi connection details');
    }
    secrets = JSON.parse(secrets.SecretString);
    return secrets;
}