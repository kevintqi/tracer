
var should = require('chai').should();
var Model = require("./sdk-model");
var Couchbase = require("../index");
var Query = new Couchbase.Query();

describe("#Query", function(){

	it("Query interface", function() {
		let q = Query.where("path").eq("foo")
		.where("path2").gt(2).lt(4)
		.where("path3").lte(19);

		//console.log(q.execute());
	});
});
