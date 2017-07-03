var Validator = require("../validator"),
    AEGError = require("../../../../sdk-error"),
    _ = require("lodash");

var errors = AEGError.errors;

module.exports = class NumberValidator extends Validator {
	constructor(path, options) {
		super(path, options);
		
		options = _.defaults(options, {min: null, max: null});
		this.min = options.min;
		this.max = options.max;
	}

	cast(val) {
		return Number(val);
	}

	validate(num) {
		num = this.cast(num);

	    if (isNaN(num)) {
	        return this.addError(errors.NOT_A_NUMBER);
	    }

	    if (this.min && num < this.min) {
        	return this.addError(errors.BAD_NUMBER_RANGE, {msgParams: ["number is less than min: " + this.min]});
        } else if (this.max && num > this.max) {
        	return this.addError(errors.BAD_NUMBER_RANGE, {msgParams: ["number is greater than max: " + this.max]});
        } else {
        	return num;
        }
	}
};