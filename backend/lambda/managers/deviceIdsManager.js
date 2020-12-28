const BaseManager = require('./_baseManager');

const { promisePool } = require('../common/utils');
const { TABLE } = require('../common/constant');


class DeviceIdsManager extends BaseManager {

    /**
     * Create inset bulk query
     * @param {*} jsondata 
     * @param {*} ingestionId 
     * @param {*} batchSize 
     */
    createBatchQuery(jsondata, ingestionId, batchSize) {
        const insertQueries = [];
        let query = [];
        const insertQuery = `INSERT INTO ${TABLE.DEVICE_IDS} (uid, device_type, ingestion_id) VALUES `;
        jsondata.forEach((json, counter) => {
            if ((counter + 1) % batchSize === 0) {
                insertQueries.push(insertQuery + query.join(','));
                query = [];
            } else {
                query.push(`('${json.uid}','${json.platform}','${ingestionId}')`);
            }
        })
        insertQueries.push(insertQuery + query.join(','));
        return insertQueries;
    }


    /** insert json in bulk */
    async bulkInsert(jsondata, ingestionId) {
        const batchSize = 1000;
        const insertQueries = this.createBatchQuery(jsondata, ingestionId, batchSize);
        const { completedPromises, failedPromises } = await promisePool(
            insertQueries,
            async (query) => {
                await this.connection.query(query);
            }
        );
        console.log('completedPromises : ==>', completedPromises.length * batchSize);
        console.log('   failedPromises : ==>', failedPromises.length * batchSize);
        if (!completedPromises.length) {
            throw Error('No Row inserted');
        }
    }

    async getDeviceIdsByIngestionId(ingestionId, limit) {
        const response = await this.connection.query(
            `SELECT uid, device_type as platform FROM ${TABLE.DEVICE_IDS} WHERE ingestion_id = '${ingestionId}' limit ${limit}`
        );
        return response ? JSON.parse(JSON.stringify(response)) : [];
    }

}

module.exports = DeviceIdsManager;