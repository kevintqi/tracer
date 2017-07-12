var AEGError = require("../../../sdk-error"),
    _ = require("lodash");

var ServiceError = AEGError.ServiceError,
    errors = AEGError.errors,
    ErrorCollection = AEGError.ErrorCollection;

module.exports = class Validator {

	constructor(path, options) {
		options = _.defaults(options, {defaultValue: null});
		
		this.defaultValue = options.defaultValue;
		this.path = path;
		this.errors = new ErrorCollection();
		this.hasError = false;
	}

	addError(error, options){
		let serviceError = new ServiceError(error, this.path, options);
		this.errors.addError(serviceError);
		this.hasError = true;
		return serviceError;
	}

	applyFunctions(val, instance) {
		var result;

		if (this.cast) {
			result = this.cast(val);
		}

		return result;
	}
};