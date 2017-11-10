import { asyncIt } from '../utils/async-it';

export default class TableOps {
    constructor(query, tableService, operation) {
        this.query = query;
        this.tableService = tableService;
        this.operation = operation;
    }

    async run() {
        try{
            if (this.operation === 'getUrl')
                throw new Error ('This API is not yet implemented')

            return await asyncIt(cb => this.tableService[this.operation](this.query.tableName, cb)).then(result => {
                return result;
            });
        } catch (error){
            return error;
        }
    }
}
