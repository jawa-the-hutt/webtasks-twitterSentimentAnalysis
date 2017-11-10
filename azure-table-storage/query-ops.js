import azure from 'azure-storage';
import { asyncIt } from '../utils/async-it';
import * as entityUtils from './utils';

export default class QueryOps {
    constructor(query, tableService) {
        this.query = query;
        this.tableService = tableService;
    }

    async run () {
        let _query = new azure.TableQuery();

        // make comma delimted list an array for the API to consume
        if(this.query.select)
            _query = _query.select(this.query.select.split(","));  

        if(this.query.top)
            _query = _query.top(this.query.top);

        // next several functions allow us to use common operaters when doing 'where' operations.
        // there is technicaly a 'Not' operator available as well and might be added later
        // if the correct syntax to make it work can be figured out.
        // There may be additional ways to filter records with operators like startsWith & endsWith, but
        // those need to be explored further.
        if(this.query.where){   
            let mapObj = {
                '==': ' eq ',
                '=': ' eq ',
                '!=': ' ne ',
                '>': ' gt ',
                '<': ' lt ',
                '>=': ' ge ',
                '<=': ' le ',
                ' And ': ' and ',
                ' Or ': ' or '
            }
            this.query.where = this.query.where.replace(/==|=|!=|>|<|>=|<=| And | Or /gi, (matched) => {
                return mapObj[matched]  // does the substitute
            })
            _query = _query.where(this.query.where);
        }    
        
        try{
            const pagedQuery = async (continuationToken) => {   
                try {
                    let returnedEntities = [];
                    let loopCounter = 0;

                    // the API will return a max of 1000 records at a time. This means if
                    // there is a top value present, we'll calculate the number of pages we need
                    // based off the top value. e.g.  top value of 5 means 1 page and a top value of 5000 means 5 pages.
                    // if there is no top value present in the query, then we assume an essentilaly infinite amount of
                    // loops are permissible until we return all rows across the pages.  
                    // Number.MAX_SAFE_INTEGER = 9,007,199,254,740,991 or ~9 quadrillion loops.
                    let maxloops = this.query.top ? Math.floor(this.query.top / 1000) : Number.MAX_SAFE_INTEGER;
    
                    // the API returns a continuation token after each loop.  If there are no more records, then the
                    // token is null.  However, there is an issue with the API in that if you select something like 
                    // a top value of 1, then it will go through the loop and even though it should be
                    // smart enough to know you don't want any more records, it will return a token.  Because it 
                    // returns a token, if you don't have an extra check in place, you will get 2 records returned.
                    // it essentially sets up an N+1 scenario when all you really want is N.
                    // With the while loop setup like this, it will return N number of records.
                    while(loopCounter <= maxloops && continuationToken !== null){
                        loopCounter++;
                        await asyncIt(cb => this.tableService.queryEntities(this.query.tableName, _query, continuationToken, cb)).then(result  => {
                            for(let entity of result.entries) {
                                returnedEntities.push(entityUtils.deserializeEntity(entity));
                            };
                            continuationToken = result.continuationToken;
                        });
                    }
    
                    return returnedEntities;
                } catch(error) {
                    throw error;
                }
            }
    
            let pq = await pagedQuery().then(returnedEntities => {
                return returnedEntities;
            });
    
            return pq;
        } catch (error){
            return error;
        }
    }


}