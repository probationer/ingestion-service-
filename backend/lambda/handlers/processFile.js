const excelToJson = require('convert-excel-to-json');
const BaseHandler = require('./_baseHandler');
const ReponseHandler = require('./_responseHandler');
const AWS = require('aws-sdk');
const { MANAGERS } = require('../common/constant');

const s3 = new AWS.S3();

class ProcessFile extends BaseHandler {

    constructor() {
        super(true);
    }

    // params = {
    //     *          Bucket: `multiply-uploads-prod`,
    //     *          Key: `folderName/key`
    //     *      };
    async getFileFromS3(s3Key) {
        const params = {
            Bucket: 'ingestion-service-dev-2',
            Key: s3Key
        }
        console.log({ params })
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

    async getJsonFromXlsx(data) {
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

    validateJson(jsonData) {
        return jsonData.filter(json => json.uid && json.platform);
    }

    async process(event, context, callback) {
        console.log({ event })
        const { ingestionId, s3Key } = event.Payload;
        const csvFile = await this.getFileFromS3(s3Key);
        const jsonData = await this.getJsonFromXlsx(csvFile);
        const filterData = this.validateJson(jsonData);

        
        console.log(jsonData);
        /**
         * 1. get file from s3
         * 2. create json file from csv
         * 3. validate json
         * 4. bulk update json file
         * 5. update status according to ingestion Id
         * 
         */
    }

}

exports.main = async (event, context, callback) => {
    return await new ProcessFile().handler(event, context, callback);
}