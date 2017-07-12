"use strict";
const Model = require("./sdk-model");
const schema = require("../model/users");
const couchbaseConfig = require('../../config/couchbase-config.json');
const log = require('../lib/log');
const DAO = require("./dao");

/** @module dao/userdao **/

/*
 * User Data Access Object 
 * @class UserDao 
 * @extends DAO 
 * This object is used to store/save channel
 * information. For available API see object DAO.
 */
class UserDao {

    constructor() {
        this.dao = new DAO(couchbaseConfig, schema);
    }

    getBy(id) {
        return this.dao.retrieve(id.toString()).then(d => {
            return d.data;
        });
    }

    getAll() {
        return this.dao.findAll().then(users => {
            return users.map(c => {
                return c.data;
            });
        });
    }

    save(userData) {
        const jData = {
            'id': userData.userId.toString(),
            'data': userData
        };
        return this.dao.retrieve(jData.id).then(data => {
            return this.dao.update(jData).then(d => {
                return d.data;
            });
        }).catch(() => {
            return this.dao.create(jData).then(d => {
                return d.data;
            });
        });
    }

    purgeAll() {
        return this.dao.destroyAll();
    }

    remove(id) {
        return this.dao.destroy(id.toString());
    }

}

module.exports = UserDao;