
var should = require('should');
var Schema = require("../index").Schema;

describe("#Schema", function(){
	let schema;

	before(function(){
		schema = new Schema({
			options: {

			},
			attributes: {
				name: {
					type: 'string',
					options: {maxLength: 30, allowEmpty: false}
				},
				age: {
					type: 'number',
					options: {max: 100}
				},
				relatedTo: {
					name: {
						type: 'string'
					}
				}
			}
		});
	});

	it("should contain paths to attributes", function() {
		should(schema.paths.name).not.equal(undefined);
		should(schema.paths.age).not.equal(undefined);
		should(schema.paths["relatedTo.name"]).not.equal(undefined);
		should(schema.nested["relatedTo"]).be.true();
	});

	it("should validate object based on the schema", function(){
		let obj = {
			name: "izzy",
			age: 27,
			relatedTo: {
				name: "alien"
			}
		};
	});
});