var Schema = require("./schema"),
	AEGError = require("../../../sdk-error"),
    _ = require("lodash");

var ServiceError = AEGError.ServiceError,
    errors = AEGError.errors,
    ErrorCollection = AEGError.ErrorCollection;

function ModelFactory(modelName, schema) {

	class Model {
		constructor(obj) {
			let proto = this;
			const $__ = this.$__ = {};
			
			$__.proto = proto;
			$__.getters = {};

			let id;
			$__.isNew = true;

			if (obj && obj.id) {
				id = obj.id;
			} else {
				if (this.schema.autoId) {
					id = this.schema.idGetter();
					obj.id = id;
				}
			}

			this._id = id;
			this.errors = {};
			this.paths = {};
			this.doc = {};
			this.set(obj);

			return this.$__.proto;
		}
		
		init() {
			this.$__.isNew = false;
		}

		serialize() {
			return _.defaults(this.doc, {id: this.id});
		}

		_set(path, val, subpaths) {
			let l = subpaths.length,
				obj = this.doc,
				i = 0;

			for (; i < l ; i++) {
				let subpath = subpaths[i];
				let next = i + 1;
				let last = next === l;

				if (last) {
					obj[subpath] = val;
				} else {
					if (_.isObject(obj[subpath]) || _.isArray(obj[subpath])) {
						obj = obj[subpath];
					} else {
						obj = obj[subpath] = {};
					}
				}
			}
		}

		get(key) {
			return _.get(this.doc, key);
		}

		setVal(path, v) {
			_.set(this.doc, path, v);
		}

		set(path, val) {
			if (_.isObject(path)) {
				let paths = Object.keys(path),
					len = paths.length,
					prefix = val === void 0 ? "" : val + ".";

				while (len--) {
					let key = paths[len];
					let isNested = this.schema.nested[key];
					let attributePath = prefix + key;
					if (path[key] !== null &&
						path[key] !== void 0 && 
						this.schema.paths[attributePath] &&
						this.schema.pathType[attributePath] === "Object"
						) {
						this.set(path[key], prefix + key);
					}  else {
						this.set(prefix + key, path[key]);
					}
				}

				return this;
			}

			if (this.schema.nested[path]) {
				if (_.isPlainObject(val) && Object.keys(val).length) {
					this.set(val, path);
				} else {
					this.setVal(path, {});
				}
				return this;
			}

			val = this.validate(path, val);

			this._set(path, val, path.split("."));
		}

		validate(path, val) {
			let validator = this.schema.paths[path];
			let orgVal = this.get(path);
			val = validator.validate(val);

			if (val.constructor.name === ServiceError.name) {
				this.markPathError(path, val);
				return orgVal;
			}

			this.clearPathError(path);
			return val;
		}

		markPathError(path, error) {
			this.errors[path] = error;
		}

		clearPathError(path) {
			if (this.errors[path]) {
				delete this.$__.errors[path];
			}
		}

		isError(path) {
			if (path) { 
				return path in this.errors;
			}

			return Object.keys(this.errors).length > 0;
		}

		_setSchema(obj) {
			let schema = new Schema(obj);
			this.schema = schema;
			compose(schema.tree, this, null, obj.options);
			if (obj.methods) {
				addMethods(this, obj.methods);
			}
		}

	}

	Model.prototype._setSchema(schema);
	Model.schema = Model.prototype.schema;
	Model.modelName = modelName;

	function addMethods(proto, methods) {
		let methodName;
		for (methodName in methods) {
			proto[methodName] = methods[methodName];
		}
	}


	function compose(attributes, proto, prefix, options) {
		let keys = Object.keys(attributes),
			i;

		for (i = keys.length - 1; i >= 0; i--) {
			let key = keys[i];

			defineProp(proto,
				key, 
				attributes[key].type === void 0 && 
				!Array.isArray(attributes[key]) ?
				attributes[key] 
				: null,
				prefix,
				keys,
				options);
		}
	}

	function defineProp(proto, key, subprops, prefix, keys, options) {
		prefix = prefix === null ? "" : prefix + ".";
		var path = prefix + key;

		if (subprops) {
			Object.defineProperty(proto, key, {
	      		enumerable: true,
	      		configurable: true,
				get: function() {
					if (!this.$__.getters) {
						this.$__.getters = {};
					}

					if (!this.$__.getters[path]) {
						let nested = _.create(this, {});

						if (!prefix) {
							nested.$__.scope = this;
						}

						let i = 0, len = keys.length;

						for (i ; i < len ; i++) {
							Object.defineProperty(nested, keys[i], {
								enumerable: false,
								writable: true,
								configurable: true,
								value: undefined
							});

							Object.defineProperty(nested, '$__isNested', {
								enumerable: true,
					            configurable: true,
					            writable: false,
					            value: true
					        });
						}

						compose(subprops, nested, path, options);
						this.$__.getters[path] = nested;
					}

					return this.$__.getters[path];
				},
				set: function(v) {
					return (this.$__.scope || this).set(path, v);
				}
			});			
		} else {
			Object.defineProperty(proto, key, {
	      		enumerable: true,
	      		configurable: true,
				get: function() {
					return this.get.call((this.$__.scope || this), path);
				},
				set: function(v) {
					return this.set.call((this.$__.scope || this), path, v);
				}
			});
		}
	}

	return Model;
}

module.exports = exports = {
	extend: function(modelName, schema){
		return ModelFactory(modelName, schema);
	},
	Schema: Schema
};
