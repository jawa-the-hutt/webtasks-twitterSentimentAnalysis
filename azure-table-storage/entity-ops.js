import azure from 'azure-storage';
import { asyncIt } from '../utils/async-it';
import Utils from './utils';

export default class EntityOps {
    constructor(query, tableService, operation) {
        this.query = query;
        this.tableService = tableService;
        this.operation = operation;
        this.utils = new Utils();
        this.serializeEntity = this.utils.serializeEntity;
        this.deserializeEntity = this.utils.deserializeEntity;
        this.ensureTableExists = this.utils.ensureTableExists;
    }

    async run () {
        try{

            let loopCount = 0;
            let batchIndex = 0;

            // if retrieving entities, then Azure API limits to one record per batch which is essentially useless for batching purposes
            // For all other batchable operatoins, we can have 100 in a batch at a time
            let maxItemsInBatch = this.operation === 'retrieveEntity' ? 1 : 100; 
            
            // what will eventually be sent back to the client
            let returnedEntities = [];

            // allows us to store the batch operations for use later in a parallel async/await process
            let batches = [];
            
            // if only one entity was sent in, we encapulate it in an array.  We are basically tricking all requests
            // to operate as a batch, even when there is only one record requested.
            let data = typeof this.query.data === Object ? [this.query.data] : this.query.data; 

            // determine how many batches we'll need by getting the number of items to process and dividing it by the maxNumber allowed per batch
            let numOfBatches = Math.ceil(data.length / maxItemsInBatch);        
    
            // loop until we have the batches setup
            while(loopCount <= numOfBatches - 1){                           
                // setup the batch function to run.
                let batch = new azure.TableBatch();

                // get the chunk of data we need for this batch.  With the index item, we can 
                // keep track of what chunks of data have already been processed on a previous loop
                for(let entity of data.slice(batchIndex, (batchIndex + maxItemsInBatch))){  
                    // get data ready for azure api.  this is more of a dynamic entity generator function
                    // so that all the appropriate odata tags get added. 
                    entity = await this.serializeEntity(entity);

                    if(entity instanceof Error){
                        throw entity;
                    } else {
                        // retrieve batch has different api structure needed when calling it.
                        if(this.operation === 'retrieveEntity') {                               
                            batch[this.operation](entity.PartitionKey._, entity.RowKey._);
                        } else {
                            batch[this.operation](entity, {echoContent: true});
                        }
                    }
                }

                loopCount++;
                batchIndex += maxItemsInBatch;

                // push the batch info to an array for use later in the parallel async/await function
                batches.push(batch); 
            }
            
            // Runs all batches in parallel so that we aren't waiting for one batch to finish before starting the next.
            // Once we gather all the batches up, we run them but make everything wait on the promise chain
            // IMPORTANT: there is a risk with Promise.all in that if one batch fails, it could fail out the entire run at 
            // what ever point the process is at.  this could mean failure on the first batch attempted and all subsequent
            // unprocessed batches will fail as well.
            // the internal try/catch inside the chain will try an mitigate this an only cause a particular batch to fail.
            const executeBatches = await Promise.all(batches.map(
                async (batch) => {
                    try {
                        await this.executeBatch(this.query.tableName, this.tableService, batch).then(result => {
                            // concatenate results into the returnedEntities array so that 
                            // we return the total aggregate of all batch results back to the client
                            returnedEntities = returnedEntities.concat(result);
                            return;
                        });
                    } catch (error){
                        throw error;
                    };
                }
            )).then(r => {
                // only iterate below if we are reading records
                if(this.operation === 'retrieveEntity') {
                    let entityCounter = 0;
                    const deserialize = async () => {
                        try {
                            // iterate through the returnedEntities and deserialize the entity object
                            // back to regular javascript values.
                            while (entityCounter < returnedEntities.length) {
                                for(let returnedEntity of returnedEntities) {
                                    returnedEntity.entity = await this.deserializeEntity(returnedEntity.entity);
                                    entityCounter++;
                                }
                            }
                            return returnedEntities;
                        } catch (error){
                            throw error;
                        };
                    }
                    let des = deserialize().then(re => {
                        return re;
                    })
                    return des;
                } else {
                    return returnedEntities;
                }
            }); 

            const runBatches = await this.ensureTableExists(this.query, this.tableService).then(result => {
                // only way we execute the batches is if the table called by the client previously existed.
                // we assume the client already knows the table schema and if not, then we reject the operations
                if(result) {
                    return executeBatches;
                }
            });

            return runBatches;
        } catch (error){
            return error;
        }
    }

    // runs the actual batch against the API
    async executeBatch(tableName, tableService, batch) {
        try{
            return await asyncIt(cb => tableService.executeBatch(tableName, batch, cb)).then(result => {
                return result
            });
        } catch (error){
            return error;
        }
    }
}
