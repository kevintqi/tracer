"use strict";
const N1qlQuery = require('couchbase').N1qlQuery;
const Couchbase = require("./sdk-couchbase");
const Model = require("./sdk-model");
const log = require('../lib/log');

/** @module dao/DAO **/

/**
 * Data Object Access 
 * @class DAO
 * This object is used to save/retrieve information from couchbase.
 **/
class DAO {
    /**
     * @constructor
     * @property {json} cbConfig The couchbase configuration. 
     * @property {json} schema The schema for saving the object.
     **/
    constructor(cbConfig, schema) {
        const DataSchema = Model.extend("DataSchema", schema);
        Couchbase.connect({
            server: cbConfig.cluster
        });
        this.DataModel = Couchbase.extend(DataSchema, {
            'bucket': cbConfig.bucket
        });
    }

    /**
     * @function create
     * Create a new data entry with inputData and save it to couchbase
     * @param {object} inputData The data to save
     * @return {promise} The entry created if success or err
     */
    create(inputData) {
        const item = new this.DataModel(inputData);
        return new Promise((resolve, reject) => {
            item.save().then(() => {
                resolve(item.doc);
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * @function retrieve
     * Retrieves a data entry based on the id
     * @param {string} id The id used to retrieve the data.
     * @return {promise} The entry found or err
     */
    retrieve(id) {
        return new Promise((resolve, reject) => {
            this.DataModel.findOne(id).then(item => {
                resolve(item.doc);
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * @function findAll
     * Get an array of enties from the bucket with specified filter
     * @param {string} where The filter, such as 'advancedChannel=true'
     * @return {promise} Success or err
     */
    findAll(where) {
        let self = this;
        return new Promise(function(resolve, reject) {
            const selectClause = 'SELECT * ',
                fromClause = 'FROM `' + self.DataModel.bucket._name + '` ';
            let whereClause = 'WHERE item.';

            if (where !== undefined) {
                whereClause += where;
            } else {
                whereClause = '';
            }
            const query = selectClause + fromClause + whereClause;
            log.info(query);
            const n1query = N1qlQuery.fromString(query);
            self.DataModel.bucket.query(n1query, function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.map(d => {
                        return d[self.DataModel.bucket._name].item;
                    }));
                }
            });
        });
    }

    /**
     * @function update
     * Update the existing entry with a new one for the same id
     * @param {object} entry The new entry
     * @return {promise} The updated entry or err
     */
    update(entry) {
        return new Promise((resolve, reject) => {
            this.DataModel.findOne(entry.id).then(item => {
                item.doc = entry;
                item.save().then(() => {
                    resolve(item.doc);
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * @function destroy
     * Remove an entry for the given id
     * @param {string} id The unique id
     * @return {promise} Success or err
     */
    destroy(id) {
        return this.DataModel.destroy(id);
    }

    /**
     * @function destroyAll
     * Purge(Flush) all entries for the bucket
     * @return {promise} Success or err
     */
    destroyAll() {
        const bucketMgr = this.DataModel.bucket.manager();
        return new Promise((resolve, reject) => {
            bucketMgr.flush(function(err, status) {
                if (status) {
                    resolve(status);
                } else {
                    log.error(err);
                    reject(err);
                }
            });
        });
    }
}

module.exports = DAO;