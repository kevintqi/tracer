var Validator = require("../validator"),
    AEGError = require("../../../../sdk-error"),
    _ = require("lodash");

var errors = AEGError.errors;

module.exports = class BooleanValidator extends Validator {
	constructor(path, options) {
		super(path, options);
	}

	cast(val) {
		return Number(val);
	}

	validate(bool) {
        var strBool,
        	hasError = false;

        if (!_.isBoolean(bool)) {
            if (!_.isNil(bool)) {
                strBool = (bool+"").toLowerCase();
                if ((strBool === "t" || strBool === true.toString())) {
                    return true;
                } else if (strBool === "f" || strBool === false.toString()) {
                    return false;
                } else {
                    hasError = true;
                }
            } else {
                hasError = true;
            }
        }

        if (hasError) {
        	return this.addError(errors.BAD_BOOLEAN);
        }

        return bool;
	}
};