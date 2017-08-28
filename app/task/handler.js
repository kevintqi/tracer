"use strict";

const EventEmitter = require('events');
const log = require('../lib/log');
const taskMapper = require('../task/task_mapper');

/**
 * @class Handler
 * This object is used to ...
 */
class Handler {

    /**
     * @constructor
     */
    constructor(type, option) {
        this.event = new EventEmitter();
        this.data = {};
        this.status = {};
        this.type = type;
        this.option = option;
    }

    /**
     * Public interface
     * The runner of the handler
     * @return {Promise}
     */
    run() {
        return new Promise((resolve, reject) => {
            this.event.on('error', () => {
                reject(this.status);
            });
            this.event.on('ready', () => {
                resolve(this.data);
            });
            this.buildData_();
        });
    }

    /**
     * Fill internal data array 
     * @return {object}
     */
    buildData_() {
        this.data = {};

        if (taskMapper[this.type].name === undefined) {
            this.status.msg = "Unknown mapping";
            log.error(msg);
            this.event.emit('error');
        }

        taskMapper[this.type].fnc(this.option).then(data => {
            this.data = data;
            this.event.emit('ready');

        }).catch(err => {
            this.status.msg = err;
            log.error(err);
            this.event.emit('error');

        });
    }
}

module.exports = Handler;