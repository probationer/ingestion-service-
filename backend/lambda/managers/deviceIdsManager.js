const BaseManager = require('./_baseManager');

const { promisePool } = require('../common/utils');


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
        const insertQuery = 'INSERT INTO device_ids (uid, device_type, ingestion_id) VALUES ';
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
    }

}

module.exports = DeviceIdsManager;