'use strict';

var couchbase  = require('couchbase');

var Couchbase = {
	extend(model, options={}) {
		let bucketName = options.bucket,
			docType,
			bucket;

      	bucket = this.getBucket(bucketName);


		function _applyModel(doc) {
			let item = doc.value.item;

			if (options.raw) {
				return item;
			}

			let instance = new model(item);
			instance.init();
			
			return instance;
		}      	

		docType = model.name.toLowerCase();
		model.__proto__ = CouchbaseOps;
		model.prototype.__proto__ = CouchbaseOps.prototype;

		model.prototype.save = function(options) {
			if (this.$__.isNew) {
				this.$__.isNew = false;
				return this.create(options);
			}

			return this.update(options);
		};

		model.prototype.docType = docType;
		model.bucket = model.prototype.bucket = bucket;
		model._applyModel = model.prototype._applyModel = _applyModel;
		model.prototype._meta = {
			created: null,
			docType: docType
		};

		return model;
	},

	connect: function connect(options) {
		if (options.mock) {
			couchbase = couchbase.Mock;
		}

		let connection = this.getConnection(options.server);

		return connection;
	},

	buckets: {},

	connection: null,

	getConnection: function(host) {
		if (this.connection !== null) {
			return this.connection;
		}

		var cluster = new couchbase.Cluster(host);
		this.connection = cluster;
		return cluster;
	},

	getBucket: function (name) {
		if (this.buckets[name]) {
			return this.buckets[name];
		}

		var bucket = this.connection.openBucket(name, function(err){
			if (err) {
		        throw Error("Failed to connect to cluster: " + err);
		    }
		});

		this.buckets[name] = bucket;
		return bucket;
	}
};

var toBool = {
	'true': true,
	'false': false
};

function convertValue(value) {
	var val;

	val = parseInt(value, 10);

	if (!isNaN(val)) {
		return val;
	}

	if (toBool.hasOwnProperty(value)) {
		return toBool[value];
	}

	return '"' + value + '"';
}

function _callbackHandler (callback) {
	
	
	return function handler(err, result) {
		if (err) {
			callback(err);
			return;
		}
		
		callback(err, result);
	}
}

var CouchbaseOps = class CouchbaseOps {
	constructor() {

    }

	_apply(opType, id, item, options) {
		let _this = this,
			op;

		switch (opType) {
			case "update":
				op = this._update;
				break;
			case "insert":
				op = this._create;
				break;
			case "destroy":
				op = this._destroy;
				break;				
			default:
				throw TypeError("unknown operation");
		}

   	  	return new Promise(function(resolve, reject) {
			function afterApply(err, result) {
				if (err) {
					return reject(err);
				}

				resolve();
			}

   	  		op.apply(_this, [id, item, options, afterApply]);
   	  	});
	}

	_create(id, item, options, callback) {
		this.bucket.insert(id, item, options, callback);
	}

	_update(id, item, options, callback) {
		this.bucket.replace(id, item, options, callback);
	}
	
	_destroy(id, item, options, callback) {
		let self = this;
		
		this.bucket.remove(id, options, function(err, result) {
			if (err) {
				callback(err);
				return;
			}
			
			self.$__.isNew = true;
			callback(err, result);
		});
	}

	create(options={}) {
		let id = this.id, 
			doc, 
			_meta = this._meta,
			item = this.serialize();

		_meta.created = new Date();

		doc = {
			_meta: _meta,
			item: item
		};

		return this._apply('insert', id, doc, options);
	}

	update(options={}) {
		let id = this.id,
			_meta = this._meta,
			item = this.serialize(),
			doc;

		_meta.lastUpdate = new Date();

		doc = {
			_meta: _meta,
			item: item
		};

		return this._apply('update', id, doc, options);
	}
	
	destroy(options={}) {
		let id = this.id,
			doc = {};

		return this._apply('destroy', id, doc, options);		
	}
	
	static destroy(id) {
		let _this = this;
		return new Promise(function(resolve, reject) {
			_this.bucket.remove(id, function(err, result) {
				if (err) {
					return reject(err);
				}
				
				resolve();
			});
		});		
	}

	static findOne(id) {
		let _this = this;
		return new Promise(function(resolve, reject) {
			_this._findById(id, function(err, result) {
				if (err) {
					return reject(err);
				}
				resolve(_this._applyModel(result));
			});
		});
	}

	static _findById(id, callback) {
		this.bucket.get(id, callback);
	}

	static findAll(where) {
		let _this = this,
			selectClause = 'SELECT * ',
			fromClause = 'FROM `' + this.bucketName + '`',
			whereClause = '',
			query;

		Object.keys(where).forEach(function(key, i) {
			if (i === 0) {
				whereClause = 'WHERE ';
			} else {
				whereClause += ' AND ';
			}

			whereClause += key + ' = ' + convertValue(where[key]);
		});

		query = selectClause + fromClause + whereClause;

		return new Promise(function(resolve, reject) {
			_this.bucket.query(query, function(err, results) {
				if (err) {
					reject(err);
				} else {
					resolve(results.map(_this._applyModel));
				}
			});
		});
	}
};

class Query {

	constructor(path, model=null, ctx=null) {
		let proto = ctx || this;
		this.path = path;
		this.whereClause = [];
		this.proto = proto;
	}

	_addOp(op, v) {
		let _op = OpMap[op];

		if (v === null || v === undefined) {
			if (_op === "=") {
				_op = "is";
			} else if (_op === "!=") {
				_op = "is not";
			}

			v = null;
		}

		this.addWhere(new Op(_op, this.path, v));
		return this;
    }

	eq(v) {
		return this._addOp("eq", v);
	}

	ne(v) {
		return this._addOp("ne", v);
	}

	gt(v) {
		return this._addOp("gt", v);
	}

	lt(v) {
		return this._addOp("lt", v);
	}

	lte(v) {
		return this._addOp("lte", v);
	}

	gte(v) {
		return this._addOp("gte", v);
	}

	addWhere(op) {
		this.whereClause.push(op);
	}

	where(path) {
		this.path = path;
		return this;
	}

	execute() {
		let selectClause = "SELECT FROM default ",
			whereClause = "";

		let i = 0, len = this.whereClause.length;

		for (; i < len ; i++) {
			let first = i === 0;

			if (first) {
				whereClause = "WHERE ";
			} else {
				whereClause += " AND ";
			}

			whereClause += this.whereClause[i].compile();
		}

		return selectClause + whereClause;
	}
}

class Op {

	constructor(op, left, right) {
		this.op = op;
		this.left = left;
		this.right = right;
	}

	compile() {
		let op = this.op,
			left = this.left,
			right = this.right;

		return `${left} ${op} ${right}`;
	}
}

var OpMap = {
	eq: "=",
	ne: "!=",
	gt: ">",
	lt: "<",
	gte: ">=",
	lte: "<="
};

Couchbase.Query = Query;
module.exports = Couchbase;