
const ResponseHandler = require('../handlers/_responseHandler');
const ManagerFatory = require('../managers/_managerFactory');
const { getConnection } = require('../common/db');

let dbConnection = null;

class BaseHandler {

    // process will be overidden in child class
    async process(event, context, callback) { };

    // create database connection
    async initDbConnection() {
        if (!dbConnection) {
            dbConnection = await getConnection();
            this.connection = dbConnection;
        } else {
            this.connection = dbConnection;
        }
    }

    async initDbManager() {
        await this.initDbConnection();
        this.dbManager = new ManagerFatory(this.connection);
    }

    // request will converge handler 
    async handler(event, context, callback) {
        console.log('INSIDE BASEHANDLER FUNCTION : ', JSON.stringify(event));

        context.callbackWaitsForEmptyEventLoop = false;
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