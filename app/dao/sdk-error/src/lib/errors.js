"use strict";

var _ = require("lodash");

/*
 * i18n message based on lang code.
 * TODO: implement i18n
 */
function i18n(message) {
	return message;
}

var errorList = {
	'MISSING_ATTRIBUTE': i18n("{0} is missing"),
	'BAD_DATE': i18n("incorrect date"),
	'NOT_A_NUMBER': i18n("not a number"),
	'BAD_NUMBER_RANGE': i18n("{0}"),
	'INVALID_OPTION': i18n("options: {0}"),
	'BAD_BOOLEAN': i18n("bad boolean"),
	'BAD_JSON_NAME': i18n("bad json name"),
	'INVALID_TEXT': i18n("invalid text"),
	'UNKNOWN_OBJECT_TYPE': i18n("unknown object type"),
	'BAD_DATE_RANGE': i18n("bad date range"),
	'BAD_JSON': i18n("bad json"),
	'NOT_FOUND': i18n("not found"),
	'IS_REQUIRED': i18n("Attribute must set as mandatory"),
	'NO_TEXT': i18n("A value must be provided"),
	'TOO_LONG': i18n("Exceeded the length requirement."),
	'RE_FAIL': i18n("Value did not match regular expression")
};


function errorMap() {
	let errorKeys = Object.keys(errorList),
		i = 0,
		l = errorKeys.length,
		name,
		result = {};

	for (; i < l ; i++) {
		name = errorKeys[i];
		result[name] = name;
	}

	return result;
}

var errors = errorMap();

var registerErrors = function registerErrors(errorObject) {
	let errorNames = Object.keys(errorObject),
		i, e;
	for (i = errorNames.length - 1; i >= 0; i--) {
		e = errorNames[i];
		errorList[e] = i18n(errorObject[e]);
		errors[e] = e;
	}
};

//Todo: move to utils
var strReplace = function(str, params) {
	if (params.length === 0) {
		return str;
	}

	let i, values = params;

	for (i = 0; i < values.length; i++) {
		str = str.replace("{" + i + "}", values[i]);
	}

	return str;
};

class ServiceError {

	constructor(error, field, options) {
		if (typeof arguments[1] == "object") {
			options = arguments[1];
			field = "";
		}

		options = _.defaults(options, {
			msgParams: [],
			code: null
		});

		this.message = errorList[error];
		this.name = error;
		this.msgParams = options.msgParams;
		this.field = field;
		this.code = options.code;
	}

	getMessage() {
		return strReplace(this.message, this.msgParams);
	}
}

class ErrorCollection {

	constructor() {
		this.errors = {};
		this._hasError = false;
	}

	addError(error) {
		this.errors[[error.name, error.field]] = error;
		this._hasError = true;
	}

	getError(error, field) {
		field = field || "";
		let key = [error, field];
		return this.errors[key];
	}

	add(error, field, options) {
		let serviceError = new ServiceError(error, field, options);
		this.addError(serviceError);
	}

	hasError(error, field) {
		if (error) {
			return this.getError(error, field) !== void 0;
		}

		return this._hasError;
	}
}


exports.ServiceError = ServiceError;
exports.ErrorCollection = ErrorCollection;
exports.errorList = errorList;
exports.errors = errors;
exports.registerErrors = registerErrors;