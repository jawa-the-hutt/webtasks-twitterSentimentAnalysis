import azure from 'azure-storage';
import isGuid from '../utils/is-guid';
import entries from 'object.entries';
import moment from 'moment';
import TableOps from './table-ops';

export default class Utils {
    constructor() {
        this.entGen = azure.TableUtilities.entityGenerator;
        this.tableOps = TableOps;
        this.isGuid = isGuid;
        this.keyRegEx = new RegExp('[^A-Za-z0-9_]');
        this.propertyNameRegEx = new RegExp('^[a-zA-Z_-][a-zA-Z0-9_-]*$');
        this.momentDateParseArray = [
            'MM/DD/YYYY', 
            'MM-DD-YYYY', 
            'DD/MM/YYYY', 
            'DD-MM-YYYY',
            '\'dd MMM DD HH:mm:ss ZZ YYYY\', \'en\'', // twitter  
            moment.ISO_8601
        ];

        // add Object.entries shim if needed
        if (!Object.entries) {
            entries.shim();
        };

        this.serializeEntity = this.serializeEntity.bind(this);
        this.deserializeEntity = this.deserializeEntity.bind(this);
        this.ensureTableExists = this.ensureTableExists.bind(this);
        
    }

    async serializeEntity(entity) {
        try {
    
            let finalObject = {}
            
            for (let [key, value] of Object.entries(entity)) {
                // __etag will be provided in different way, so skip it here too
                if (!entity.hasOwnProperty(key) || key === '__etag' || key === 'Timestamp') {
                    continue;
                };
    
                if (entity[key] === null) { // this includes undefined
                    continue;
                };
    
                // must pass tests to enusre Keys conform to azure rules.
                // key names are strictly alphanumeric only, but its better to 
                // be safe an restrict them to it.
                //
                // they must also be a string.  a number for a rowkey must be sent from
                // the client as a string.
                //
                // if we pass those tests, then we encode the value via the entity generator as a string value.
                if ((key === 'PartitionKey' || key === 'RowKey' ) && this.keyRegEx.test(value)) {
                    throw (new Error('Keys must be alphanumeric characters only'));
                } else if ((key === 'PartitionKey' || key === 'RowKey' ) && (typeof value !== 'string')) {
                    throw (new Error('Keys must be a string'));
                } else if (key === 'PartitionKey' || key === 'RowKey' ) {
                    finalObject[key] = this.entGen.String(value);
                    continue;
                };
     
                // all property names must be alphanumeric and also must start with a letter
                if (!this.propertyNameRegEx.test(key)) { 
                    throw (new Error('Column Name \'' + key + '\' must start with a letter'));
                };
                
                // if the value is a string we check to see if it's a GUID first.
                // then we check to see if we can parse it as a date
                // finally we assume it's a string
                if (typeof value === 'string') {
                    if (value.length === 36 && this.isGuid(value)) {
                        finalObject[key] = this.entGen.Guid(value);
                    } else if (moment(value, this.momentDateParseArray, true).isValid()) {
                        //console.log(moment(value, this.momentDateParseArray).format())


                        
                        finalObject[key] = this.entGen.DateTime(moment(value, this.momentDateParseArray).format());
                        //console.log('finalObject[key] - ', finalObject[key]);
                        if(finalObject[key]._ === 'Invalid date')
                            console.log('value - ', value);
                    } else {
                        finalObject[key] = this.entGen.String(value);
                    };
                // if the value is a number we check to see if it's an integer 
                // and then determine if it's 32/64 bit.  Everything else is assumed
                // to be a double.
                } else if (typeof value === 'number') {
                    if (value % 1 === 0) { // checks if it is integer
                        if (Math.abs(value) < 2147483648) {
                            finalObject[key] = this.entGen.Int32(value);
                        } else {
                            finalObject[key] = this.entGen.Int64(value);
                        };
                    } else {
                        finalObject[key] = this.entGen.Double(value);
                    }
                // is this a true/false value
                } else if (typeof(value) === 'boolean') {
                    finalObject[key] = this.entGen.Boolean(value);
                // is this binary data
                } else if (value instanceof Buffer) {
                    finalObject[key] = this.entGen.Binary(value.toString('base64'));
                // to be on a safe side, convert anything else to string
                } else { 
                    finalObject[key] = this.entGen.String(value.toString());
                }
            }
    
            return finalObject;
    
        } catch (error){
            return error;
        }
    }
    
    async deserializeEntity (entity) {
        try {
    
            let finalObject = {};
            let type;
    
            for (let [key, value] of Object.entries(entity)) {
    
                // skip all the odata info keys 
                if (!entity.hasOwnProperty(key) || key.indexOf('.metadata') >= 0) {
                    continue;
                };
    
                // handle always returns key values first
                if (key === 'PartitionKey' || key === 'RowKey') {
                    finalObject[key] = value._;
                    continue;
                } else if (key === 'Timestamp') {
                    let dateValue =  moment(value._).format();
                    finalObject[key] = dateValue;
                    continue;
                };
            
                // handle other properties but check if they need converting
                type = value['$'];
    
                if (!type) {
                    finalObject[key] = value._;
                } else {
                    if (type === 'Edm.Int64') {
                        finalObject[key] = parseInt(value._, 10);
                    } else if (type === 'Edm.DateTime') {
                        let dateValue =  moment(value._).format();
                        finalObject[key] = dateValue;
                    } else if (type === 'Edm.Binary') {
                        finalObject[key] = new Buffer(value._, 'base64');
                    // for all other do not convert
                    } else { 
                        finalObject[key] = value._;
                    };
                };
            };
          
            return finalObject;
    
        } catch (error){
            return error;
        }
    }
    
    // checks to see if the table exists.  if it does, we are good as we expected it to.
    // if it does not, then most likely we accidentally created it by having passed in a 
    // table name from the client that is incorrect.  We then go delete the bad table.
    //
    // We should always expect the client pass in a table name of something that already exists.
    async ensureTableExists (tableName, tableService) {
        try {
            let ensureTableExists = new this.tableOps(tableName, tableService, 'createTableIfNotExists');
            return await ensureTableExists.run().then(cr => {
                if (cr.isSuccessful && !cr.created ) {
                    // return true as the table exists.
                    return true;
                } else if (cr.isSuccessful && cr.created) {
                    // the table did not exist, but we didn't really want to create it as this was just
                    // a check.  We then delete the table before any data is accidentally saved
                    // to a table that now exists outside any potential documentation
                    const removeTable = async () => {
                        try {
                            let deleteTable = new this.tableOps(tableName, tableService, 'deleteTable');
                            return await deleteTable.run().then(dr => {
                                throw new Error('invalid table name specified');
                            })
                        } catch (error) {
                            throw error;
                        }
                    };
                    // this should't actually return anything as the Error throws should drop out to the bottom catcher
                    return removeTable();
                } else {
                    // return false as this should never be reached
                    return false;
                }
            });
            //return ete;
        } catch (error) {
            throw error;
        };
    }
}