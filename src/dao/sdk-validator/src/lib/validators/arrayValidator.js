var Validator = require("../validator"),
    AEGError = require("../../../../sdk-error"),
    _ = require("lodash");

var errors = AEGError.errors;

module.exports = class ArrayValidator extends Validator {
	constructor(path, options) {
		super(path, options);
	}
	
	validate(array) {
        return array;
	}
};