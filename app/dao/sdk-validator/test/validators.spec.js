var should = require('should');
var AEGError = require('sdk-error');

var ServiceError = AEGError.ServiceError;
var errors = AEGError.errors;

var _Validator = require("../index"),
	Validators = _Validator.Validators,
	Validator = _Validator.Validator;

var StringValidator = Validators.String,
	NumberValidator = Validators.Number,
	BooleanValidator = Validators.Boolean,
	DateValidator = Validators.Date;

describe("#Validators", function(){

	before(function(){	
	});

	describe("#StringValidator", function(){
		it("should not allow empty.", function(){
			var stringVal = new StringValidator("foo", {
				allowEmpty: false,
				maxLength: 10
			});

			stringVal.validate("");
			should(stringVal).be.instanceof(Validator);
			should(stringVal.errors.hasError()).be.true();
			should(stringVal.errors.hasError(errors.NO_TEXT, "foo")).be.true();
		});

		it("should allow empty.", function(){
			var stringVal = new StringValidator("foo", {
				allowEmpty: true,
				maxLength: 10
			});

			stringVal.validate("");
			should(stringVal).be.instanceof(Validator);
			should(stringVal.errors.hasError()).be.false();
			should(stringVal.errors.hasError(errors.NO_TEXT, "foo")).be.false();
		});

		it("should not error for not exceeding max length.", function(){
			var stringVal = new StringValidator("foo", {
				allowEmpty: false,
				maxLength: 3
			});

			stringVal.validate("123");
			should(stringVal).be.instanceof(Validator);
			should(stringVal.errors.hasError()).be.false();
			should(stringVal.errors.hasError(errors.TOO_LONG, "foo")).be.false();
		});

		it("should error for exceeding max length.", function(){
			var stringVal = new StringValidator("foo", {
				allowEmpty: false,
				maxLength: 3
			});

			stringVal.validate("1234");
			should(stringVal).be.instanceof(Validator);
			should(stringVal.errors.hasError()).be.true();
			should(stringVal.errors.hasError(errors.TOO_LONG, "foo")).be.true();
		});
	});

	describe("#NumberValidator", function(){
		it("should be instance of Validator.", function(){
			var numberVal = new NumberValidator("foo");
			should(numberVal).be.instanceof(Validator);
		});

		it("should reject non numbers.", function(){
			var numberVal = new NumberValidator("foo");
			numberVal.validate("x");
			should(numberVal.errors.hasError()).be.true();
			should(numberVal.errors.hasError(errors.NOT_A_NUMBER, "foo")).be.true();
		});

		it("should accept numbers as strings.", function(){
			var numberVal = new NumberValidator("foo");
			numberVal.validate("5");
			should(numberVal.errors.hasError()).be.false();
			should(numberVal.errors.hasError(errors.NOT_A_NUMBER, "foo")).be.false();
		});

		it("should reject numbers that exceed max.", function(){
			var numberVal = new NumberValidator("foo", {
				max: 10
			});
			numberVal.validate("1337");
			should(numberVal.errors.hasError()).be.true();
			should(numberVal.errors.hasError(errors.BAD_NUMBER_RANGE, "foo")).be.true();
		});

		it("should reject numbers that exceed min.", function(){
			var numberVal = new NumberValidator("foo", {
				min: 1337
			});
			numberVal.validate("1336");
			should(numberVal.errors.hasError()).be.true();
			should(numberVal.errors.hasError(errors.BAD_NUMBER_RANGE, "foo")).be.true();
		});

		it("should accept numbers between min and max.", function(){
			var numberVal = new NumberValidator("foo", {
				min: 1336,
				max: 1338
			});
			numberVal.validate(1337);
			should(numberVal.errors.hasError()).be.false();
			should(numberVal.errors.hasError(errors.BAD_NUMBER_RANGE, "foo")).be.false();
		});
	});

	describe("#BooleanValidator", function(){
		it("should be instance of Validator.", function(){
			var boolVal = new BooleanValidator("foo");
			should(boolVal).be.instanceof(Validator);
		});

		it("should bad boolean.", function(){
			var boolVal = new BooleanValidator("foo");
			var val = boolVal.validate("x");
			should(boolVal.errors.hasError()).be.true();
			should(boolVal.errors.hasError(errors.BAD_BOOLEAN, "foo")).be.true();
			should(val).be.instanceof(ServiceError);
		});

		it("should accepts boolean type `true`.", function(){
			var boolVal = new BooleanValidator("foo");
			var val = boolVal.validate(true);
			should(boolVal.errors.hasError()).be.false();
			should(boolVal.errors.hasError(errors.BAD_BOOLEAN, "foo")).be.false();
			should(val).be.true();
		});

		it("should accepts boolean type `false`.", function(){
			var boolVal = new BooleanValidator("foo");
			var val = boolVal.validate(false);
			should(boolVal.errors.hasError()).be.false();
			should(boolVal.errors.hasError(errors.BAD_BOOLEAN, "foo")).be.false();
			should(val).be.false();
		});

		it("should accepts string `false`.", function(){
			var boolVal = new BooleanValidator("foo");
			var val = boolVal.validate("false");
			should(boolVal.errors.hasError()).be.false();
			should(boolVal.errors.hasError(errors.BAD_BOOLEAN, "foo")).be.false();
			should(val).be.false();
		});

		it("should accepts string `true`.", function(){
			var boolVal = new BooleanValidator("foo");
			var val = boolVal.validate("true");
			should(boolVal.errors.hasError()).be.false();
			should(boolVal.errors.hasError(errors.BAD_BOOLEAN, "foo")).be.false();
			should(val).be.true();
		});
	});

	describe("#DateValidator", function(){
		it("should be instance of Validator.", function(){
			var boolVal = new DateValidator("foo");
			should(boolVal).be.instanceof(Validator);
		});

		it("should accept good date.", function(){
			var boolVal = new DateValidator("foo");
			var val = boolVal.validate("1988-09-15");
			should(boolVal.errors.hasError()).be.false();
			should(boolVal.errors.hasError(errors.BAD_DATE, "foo")).be.false();
			should(val).be.instanceof(Date);
		});

		it("should reject bad date.", function(){
			var boolVal = new DateValidator("foo");
			var val = boolVal.validate("bad");
			should(boolVal.errors.hasError()).be.true();
			should(boolVal.errors.hasError(errors.BAD_DATE, "foo")).be.true();
			should(val).be.instanceof(ServiceError);
		});
	});
});