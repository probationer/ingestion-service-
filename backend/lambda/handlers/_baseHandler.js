
const ResponseHandler = require('../handlers/_responseHandler');
const ManagerFatory = require('../managers/_managerFactory');
const { getConnection } = require('../common/db');

let isDbConnected;

class BaseHandler {

    // process will be overidden in child class
    async process(event, context, callback) { };

    // create database connection
    async initDbConnection() {
        if (!isDbConnected) {
            this.connection = await getConnection();
            isDbConnected = true;
        }
    }

    async initDbManager() {
        await this.initDbConnection();
        this.dbManager = new ManagerFatory(this.connection);
    }

    // request will converge handler 
    async handler(event, context, callback) {
        await this.initDbManager();
        try {
            return await this.process(event, context, callback);
        } catch (err) {
            console.log('Caught error', err);
            return ResponseHandler.callbackRespondWithSimpleMessage(401, 'Something went wrong');
        }
    }

}

module.exports = BaseHandler;