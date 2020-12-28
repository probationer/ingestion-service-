const serverlessMySQL = require('serverless-mysql');

const { DB_SECRETS } = require('../common/constant');
// create seperate mutable connection objects
// but don't connect to db yet
// these objects will remain same across executions
// as they are declared outside lambda's handler
const connections = serverlessMySQL();

async function initConnections({ host, database, user, password }) {
    const config = {
        host, database,
        user, password
    };
    connections.config(config);
    await connections.connect()
}

// function to close the connection
async function close() {
    await connections.end();
};


// get if exists or set config for connection
async function getConnection() {
    // call library function to check if
    // connection is present for this lambda
    // const dbSecret = await getSecret(`db-${process.env.STAGE}`);
    const dbSecret = { ...DB_SECRETS };
    await initConnections(dbSecret);
    return {
        query: connections.query,
        transaction: connections.transaction,
        close,
    };
}

module.exports = {
    getConnection
};
