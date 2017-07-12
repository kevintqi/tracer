var should = require('chai').should();
var Model = require("./sdk-model");
var Couchbase = require("../index");

describe("#Couchbase", function(){
	let Person;

	before(function(){
		Person = Model.extend("Person", {
			options: {

			},
			attributes: {
				name: {
					type: 'string',
					options: {length: 30}
				},
				age: {
					type: 'number',
					options: {max: 100}
				}				
			}
		});

		Couchbase.connect({server: '', mock: true});

		Person = Couchbase.extend(Person, {

		});
	});

	it("Model should have findById", function() {
		Person.should.have.property("findOne");
	});	

	it("Model should have findAll", function() {
		Person.should.have.property("findAll");
	});

	it("Model instance should inherit CouchbaseOps prototype", function() {
		var person = new Person({
			name: "foo",
			age: 21
		});
		person.should.have.property("save");
	});

	it("should persist and query the model instance.", function(done) {
		var person = new Person({
			name: "foo",
			age: 21
		});

		person.save().then((result) => {
			Person.findOne(person.id).then((result) => {
				result.should.be.instanceof(Person);
				result.name.should.equal("foo");
				result.age.should.equal(21);
				done();
			}).catch(err => {
				throw err;
			});
		}).catch(err => {
			throw err;
		});	
	});

	it("should persist an update to the model instance.", function(done) {
		var person = new Person({
			name: "foo",
			age: 21
		});

		person.save().then((result) => {
			person.age = 22;
			person.save().then((result) => {
				person.age.should.equal(22);
				done();
			}).catch(err => {
				console.log(err);

			});
		}).catch(err => {
			console.log(err);
			throw err;
		});	
	});	
});

describe("#Couchbase", function(){
	let Person;

	before(function(){
		Person = Model.extend("Person", {
			options: {

			},
			attributes: {
				name: {
					type: 'string',
					options: {length: 30}
				},
				age: {
					type: 'number',
					options: {max: 100}
				}				
			}
		});

		Couchbase.connect({server: '', mock: true});

		Person = Couchbase.extend(Person, {
			raw: true
		});
	});

	it("should persist and query the raw data.", function(done) {
		var person = new Person({
			name: "foo",
			age: 21
		});

		person.save().then((result) => {
 			Person.findOne(person.id).then((result) => {
				result.should.not.be.instanceof(Person);
				result.name.should.equal("foo");
				result.age.should.equal(21);
				done();
			}).catch(err => {
				console.log(err);
				throw err;
			});
		}).catch(err => {
			console.log(err);
			throw err;
		});	
	});	
});


describe("#Couchbase destroy", function(){
	let Person;

	before(function(){
		Person = Model.extend("Person", {
			options: {

			},
			attributes: {
				name: {
					type: 'string',
					options: {length: 30}
				},
				age: {
					type: 'number',
					options: {max: 100}
				}				
			}
		});

		Couchbase.connect({server: '', mock: true});

		Person = Couchbase.extend(Person, {
		});
	});

	it("should destroy and flag the instance as new", function(done) {
		var person = new Person({
			name: "foo",
			age: 21
		});

		person.save().then((result) => {
			person.$__.isNew.should.equal(false);
 			person.destroy().then((result) => {
				person.should.be.instanceof(Person);
				person.name.should.equal("foo");
				person.age.should.equal(21);
				person.$__.isNew.should.equal(true);
				done();
			}).catch(err => {
				console.log(err);
				throw err;
			});
		}).catch(err => {
			console.log(err);
			throw err;
		});	
	});
	
	it("should expose destroy at the class level", function(done) {
		var person = new Person({
			name: "foo",
			age: 21
		});

		person.save().then((result) => {
 			Person.destroy(person.id).then((result) => {
	 			Person.findOne(person.id).then((result) => {
	 				result.should.be.undefined;
	 				done();
				}).catch(err => {
					err.message.should.equal("key not found");
					done();
				});
			});
		});
	});		
});
