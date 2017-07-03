var Validator = require("../validator"),
    AEGError = require("../../../../sdk-error"),
    _ = require("lodash");

var errors = AEGError.errors;

module.exports = class DateValidator extends Validator {
	constructor(path, options) {
		super(path, options);
	}
	
	validate(date) {
        date = new Date(date);
        
        if (isNaN(date.getTime())) {
        	return this.addError(errors.BAD_DATE);
        }

        return date;
	}
};