const BaseHandler = require("../handlers/_baseHandler");



class BaseManager {

    constructor(conn) {
        this.connection = conn;
    }

    async select(query) {
        return await this.connection.query(query);
    }

    async create(query) {
        return await this.connection.create(query);
    }
}

module.exports = BaseManager;