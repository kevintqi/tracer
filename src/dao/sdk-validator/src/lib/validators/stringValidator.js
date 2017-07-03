var Validator = require("../validator"),
    AEGError = require("../../../../sdk-error"),
    _ = require("lodash");

var errors = AEGError.errors;

var reEmpty = /^\s*$/;
module.exports = class StringValidator extends Validator {
	constructor(path, options) {
		super(path, options);
        options = _.defaults(options, {maxLength: 100, allowEmpty: true});
        this.maxLength = options.maxLength;
        this.allowEmpty = options.allowEmpty;
	}

	cast(val) {
		return val + "";
	}

	validate(text) {
        text = text || "";
        
        if (!this.allowEmpty && (!text || text.match(reEmpty))) {
            return this.addError(errors.NO_TEXT);
        } else if (text.length > this.maxLength) {
            return this.addError(errors.TOO_LONG);
        }

        return text;
	}
};