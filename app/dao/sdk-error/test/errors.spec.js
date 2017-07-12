var should = require('chai').should();
var SDKError = require("../index");

describe("#Errors", function(){
	let errorCollection;

	before(function(){
		errorCollection = new SDKError.ErrorCollection();
		SDKError.registerErrors({
			"TEST_ERROR_NO_PARAMS": "foo",
			"TEST_ERROR_W_PARAMS": "foo {0}"
		});
	});

	describe("#ServiceError", function(){
		it("should register errors and return appropriate message.", function() {
			let serviceError = new SDKError.ServiceError(SDKError.errors.TEST_ERROR_NO_PARAMS);	
			let message = serviceError.getMessage();

			serviceError.name.should.equal(SDKError.errors.TEST_ERROR_NO_PARAMS);
			message.should.equal("foo");
		});

		it("should register errors and return appropriate message with message params.", function() {
			let serviceError = new SDKError.ServiceError(SDKError.errors.TEST_ERROR_W_PARAMS, {msgParams: ["bar"]});
			serviceError.getMessage().should.equal("foo bar");
		});	

		it("should create an error for a field", function() {
			let serviceError = new SDKError.ServiceError(SDKError.errors.TEST_ERROR_W_PARAMS, "fieldA", {msgParams: ["bar"]});
			serviceError.getMessage().should.equal("foo bar");
			serviceError.field.should.equal("fieldA");
		});

		it("should create an error for a field", function() {
			let serviceError = new SDKError.ServiceError(SDKError.errors.TEST_ERROR_W_PARAMS, "fieldA", {msgParams: ["bar"]});
			serviceError.getMessage().should.equal("foo bar");
			serviceError.field.should.equal("fieldA");
		});
	});

	describe("#ErrorCollection", function(){
		it("should add an error", function(){
			errorCollection.add(SDKError.errors.TEST_ERROR_NO_PARAMS, "fieldA");
			errorCollection.hasError().should.be.true;
			errorCollection.hasError(SDKError.TEST_ERROR_NO_PARAMS, "fieldA").should.be.true;
		});

		it("should add a Service Error", function(){
			errorCollection.addError(new SDKError.ServiceError(SDKError.errors.TEST_ERROR_NO_PARAMS, "fieldA"));
			errorCollection.hasError().should.is.true;
			errorCollection.hasError(SDKError.TEST_ERROR_NO_PARAMS, "fieldA").should.is.true;
		});
	});
});