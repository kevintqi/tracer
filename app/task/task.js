/**
 * @class Task
 **/
const isJSON = require('is-json');
const Handler = require('../task/handler');
const log = require('../lib/log');
const taskMapper = require('./task_mapper');

/**
 * @class Task
 * Object representing a task to be performed
 */
class Task {

    /**
     * @constructor
     * @param {object} type Task type 
     */
    constructor(type, option) {
        this.type = type;
        this.option = option;
    }

    /**
     * Public interface
     * Test if the task description has required attributes
     * @return {bool}
     */
    isValid() {
        if ((taskMapper[this.type].name === undefined) ||
            (this.option === undefined)) {
            return false;
        }

        if (isJSON(this.option, true)) {
            for (var attributename in this.option) {
                if ((this.option[attributename] === undefined) ||
                    (Object.keys(this.option[attributename]).length === 0)) {
                    log.error("option is invalid: " + attributename);
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Public interface
     * Create a handler for the Task
     * @return {object} 
     */
    handler() {
        return new Handler(this.type, this.option);
    }
}

module.exports = Task;