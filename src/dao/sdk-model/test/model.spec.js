
var should = require('should');
var Model = require("../index");

describe("#Model", function(){
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
	});

	it("should have a reference to the schema", function() {
		should(Person.schema).not.equal(undefined);
	});

	it("should have the name of the model", function(){
		(Person.modelName).should.equal("Person");
	});

	it("should create an instance of Person", function(){
		var tom = new Person({
			name: "tom",
			age: 30
		});

		(tom).should.be.instanceof(Person);
	});

	it("should make a reference to attributes", function(){
		var tom = new Person({
			name: "tom",
			age: 30
		});

		should(tom.name).be.equal("tom");
		should(tom.age).be.equal(30);
	});

	it("should make a reference to attributes", function(){
		var tom = new Person({
			name: "tom",
			age: 30
		});

		should(tom.name).be.equal("tom");
		should(tom.age).be.equal(30);
	});

	it("should update the reference to age", function(){
		var tom = new Person({
			name: "tom",
			age: 30
		});

		should(tom.age).be.equal(30);
		tom.age = 31;
		should(tom.age).be.equal(31);
	});

	describe("Schema with nested object", function(){
		var People;
		before(function(){
			People = Model.extend("Person", {
				options: {

				},
				attributes: {
					name: {
						type: 'string',
						options: {maxLength: 30}
					},
					age: {
						type: 'number',
						options: {max: 100}
					},
					related: {
						nestedName: {
							type: 'string',
							options: {maxLength: 5}
						}
					}	
				}
			});
		});

		it("should accept nest attributes", function(){
			var tom = new People({
				name: "tom",
				age: 30,
				related: {
					nestedName: "ben"
				}
			});

			should(tom.age).be.equal(30);
			tom.age = 31;
			should(tom.age).be.equal(31);
			should(tom.related.nestedName).be.equal("ben");
		});

		it("should have a validation error on top level attribute.", function(){
			var tom = new People({
				name: "tom",
				age: 30,
				related: {
					nestedName: "ben"
				}
			});

			should(tom.age).be.equal(30);
			tom.age = 101;
			should(tom.age).be.equal(30);
			should(tom.related.nestedName).be.equal("ben");
			should(tom.isError()).be.true();
		});

		it("should have a validation error on nested attribute.", function(){
			var tom = new People({
				name: "tom",
				age: 30,
				related: {
					nestedName: "ben"
				}
			});

			should(tom.name).be.equal("tom");
			should(tom.age).be.equal(30);
			should(tom.related.nestedName).be.equal("ben");
			tom.related.nestedName = "123456";
			should(tom.isError()).be.true();
			should(tom.isError("related.nestedName")).be.true();
		});		
	});	

	describe("Schema with array", function(){
		var People;
		before(function(){
			People = Model.extend("Person", {
				options: {

				},
				attributes: {
					name: {
						type: 'string',
						options: {maxLength: 30}
					},
					age: {
						type: 'number',
						options: {max: 100}
					},
					related: []
				}
			});
		});

		it("should accept nest attributes", function(){
			var tom = new People({
				name: "tom",
				age: 30,
				related: [1, 3, 3]
			});

			should(tom.related).be.instanceof(Array);
			should(tom.related).be.length(3);
			tom.related.push(7);
			should(tom.related).be.length(4);
		});	
	});

	describe("Schema with methods", function(){
		var People;
		before(function(){
			People = Model.extend("Person", {
				options: {

				},
				attributes: {
					name: {
						type: 'string',
						options: {maxLength: 30}
					},
					age: {
						type: 'number',
						options: {max: 100}
					},
					related: []
				},
				methods: {
					isOver18: function() {
						return this.age >= 18;
					}
				}
			});
		});

		it("should accept nest attributes", function(){
			var tom = new People({
				name: "tom",
				age: 30,
				related: [1, 3, 3]
			});

			should(tom.isOver18()).be.true();
		});	
	});

	describe("Schema with id", function(){
		var People;
		before(function(){
			People = Model.extend("Person", {
				options: {

				},
				attributes: {
					id: {
						type: 'string'
					},					
					name: {
						type: 'string',
						options: {maxLength: 30}
					},
					age: {
						type: 'number',
						options: {max: 100}
					},
					related: []
				}
			});
		});

		it("should accept a unique id", function(){
			var tom = new People({
				id: "uniqueId",
				name: "tom",
				age: 30,
				related: [1, 3, 3]
			});

			should(tom.id).be.equal("uniqueId");
			should(tom.serialize()).have.property("id").and.equal("uniqueId");
		});

		it("should generate a key", function(){
			var tom = new People({
				name: "tom",
				age: 30,
				related: [1, 3, 3]
			});

			should(tom.id).be.a.string;
			should(tom.serialize()).have.property("id");
		});
	});	

	describe("Schema with a id generator", function(){
		var People;
		before(function(){
			People = Model.extend("Person", {
				options: {
					id: function() {
						return "not so uniqueId";
					}
				},
				attributes: {
					name: {
						type: 'string',
						options: {maxLength: 30}
					},
					age: {
						type: 'number',
						options: {max: 100}
					},
					related: {
						nestedName: {
							type: 'string',
							options: {maxLength: 5}
						}
					}	
				}
			});
		});

		it("should generate an id using specified id function", function(){
			var tom = new People({
				name: "tom",
				age: 30,
				related: {
					nestedName: "ben"
				}
			});
			
			should(tom.id).be.equal("not so uniqueId");
			should(tom.serialize()).have.property("id").and.equal("not so uniqueId");			
		});	
	});
	
	describe("Schema with custom id", function(){
		var People;
		before(function(){
			People = Model.extend("Person", {
				options: {
				},
				attributes: {
					id: {
						type: 'number'
					},
					name: {
						type: 'string',
						options: {maxLength: 30}
					},
					age: {
						type: 'number',
						options: {max: 100}
					},
					related: {
						nestedName: {
							type: 'string',
							options: {maxLength: 5}
						}
					}	
				}
			});
		});

		it("should be able to assign a custom id", function(){
			var tom = new People({
				id: 505,
				name: "tom",
				age: 30,
				related: {
					nestedName: "ben"
				}
			});
			should(tom.id).be.equal(505);
			should(tom.serialize()).have.property("id").and.equal(505);			
		});	
	});		
});