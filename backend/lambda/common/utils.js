const AWS = require('aws-sdk');
const excelToJson = require('convert-excel-to-json');
const PromisePool = require('@supercharge/promise-pool')

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
exports.getJsonFromXlsx = async (data) => {
    const res = excelToJson({
        source: data,
        header: { rows: 1 },
        columnToKey: { '*': '{{columnHeader}}' }
    });
    const key = Object.keys(res);
    if (res) {
        return res[key[0]];
    }
    console.log("No result from xlsx");
    return null;
};



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
    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err) {
                console.error("Error While Downloading From Multiply Bucket", JSON.stringify(err));
                reject(err);
            } else {
                console.log("Object Downloaded Succesfully.");
                resolve(data.Body);
            }
        });
    })
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