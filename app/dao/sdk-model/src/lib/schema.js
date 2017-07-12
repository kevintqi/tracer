var AEGError = require("../../../sdk-error"),
    _ = require("lodash"),
    uuid = require('../../../node-uuid');

var ServiceError = AEGError.ServiceError,
    errors = AEGError.errors,
    ErrorCollection = AEGError.ErrorCollection,
    Validators;

module.exports = class Schema {

	constructor(obj) {
		let options = obj.options || {};
		this.paths = {};
		this.nested = {};
		this.strict = !!options.strict;
		this.pathType = {};
		this.add(obj.attributes);
		this.autoId = false;
		if (!this.paths['id']) {
			this.autoId = true;
			obj.attributes['id'] = {type: 'string'};
			this.add({'id': {type: 'string'}})
		}
		this.idGetter = options.id || uuid.v1;
		this.tree = obj.attributes;
	}

	add(obj, prefix) {
		prefix = prefix === void 0 ? "" : prefix + ".";

		let keys = Object.keys(obj);
		for (var i = keys.length - 1; i >= 0; i--) {
			let key = keys[i];
			let validatorSpec = obj[key];

			if (!Array.isArray(obj[key]) && validatorSpec.type === void 0) {
				this.nested[prefix + key] = true;
				this.pathType[prefix + key] = "Object";
				this.add(obj[key], prefix + key);
			} else {
				let name;

				if (Array.isArray(obj[key])) {
					name = "Array";
					this.pathType[prefix + key] = name;
					this.paths[prefix + key] = new Validators[name](prefix + key);
				} else {
					let attrType = validatorSpec.type;
					name = attrType.charAt(0).toUpperCase() + attrType.substring(1);
					if (Validators[name] === void 0) {
						throw new TypeError("Unknown type");
					}
					this.pathType[prefix + key] = attrType;
					this.paths[prefix + key] = new Validators[name](prefix + key, validatorSpec.options);
				}
			}
		}
	}
};

Validators = require("../../../sdk-validator").Validators;
