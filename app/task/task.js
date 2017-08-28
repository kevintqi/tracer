/**
 * @class Task
 **/
const Handler = require('../task/handler');
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

        for (var attributename in this.option) {
            if (this.option[attributename] === undefined) {
                return false;
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