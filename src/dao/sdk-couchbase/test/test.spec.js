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
		
		//mezz-image
		Couchbase.connect({server: 'couchbase://dev-int-couchbase1.aeg.cloud/', mock: false});

		Person = Couchbase.extend(Person, {
            bucket: 'mezz-image'
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
		
		function updatePerson(o) {
			o.age = 22;
			o.save().then((result) => {
				Person.findOne(o.id).then((result) => {
					result.should.be.instanceof(Person);
					result.name.should.equal("foo");
					result.age.should.equal(22);
					done();
				}).catch(err => {
					throw err;
				});
			}).catch(err => {
				throw err;
			});			
		}

		person.save().then((result) => {
			Person.findOne(person.id).then((result) => {
				result.should.be.instanceof(Person);
				result.name.should.equal("foo");
				result.age.should.equal(21);
				//done();
				updatePerson(result);
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

		//mezz-image
		Couchbase.connect({server: 'couchbase://dev-int-couchbase1.aeg.cloud/', mock: false});

		Person = Couchbase.extend(Person, {
            bucket: 'mezz-image',
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


describe("#Couchbase instance", function(){
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

		Couchbase.connect({server: "couchbase://dev-int-couchbase2.aeg.cloud/", bucket: "distribution-metadata-mds"})

		Person = Couchbase.extend(Person, {
		    bucket: 'mezz-image',
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
