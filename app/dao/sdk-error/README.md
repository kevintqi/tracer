
# Node.js SDK Error

## Installation

First install **Node.js 6.x**. Then:

```sh
$ npm install sdk-node-error
```

## Overview

### Built-in Errors

Available errors

```js
var errorList = {
	'MISSING_ATTRIBUTE': i18n("{0} is missing"),
	'BAD_DATE': i18n("incorrect date"),
	'NOT_A_NUMBER': i18n("not a number"),
	'BAD_NUMBER_RANGE': i18n("{0}"),
	'INVALID_OPTION': i18n("options: {0}"),
	'BAD_BOOLEAN': i18n("bad boolean"),
	'BAD_JSON_NAME': i18n("bad json name"),
	'INVALID_TEXT': i18n("invalid text"),
	'UNKNOWN_OBJECT_TYPE': i18n("unknown object type"),
	'BAD_DATE_RANGE': i18n("bad date range"),
	'BAD_JSON': i18n("bad json"),
	'NOT_FOUND': i18n("not found"),
	'IS_REQUIRED': i18n("Attribute must set as mandatory"),
	'NO_TEXT': i18n("A value must be provided"),
	'TOO_LONG': i18n("Exceeded the length requirement."),
	'RE_FAIL': i18n("Value did not match regular expression")
};
```

### Custom Errors

You can define custom errors.

```js

var SDKError = require("sdk-node-error"),
	errors = SDKError.errors;

SDKError.registerErrors({
	"MY_CUSTOM_ERROR": "My custom error message"
});

var error = new SDKError.ServiceError(errors.MY_CUSTOM_ERROR);

assert.equal(error.getMessage(),
      "My custom error message");

```

Messages can also have arguments.

```js
SDKError.registerErrors({
	"MY_CUSTOM_ERROR": "Reason: {0}"
});

var error = new SDKError.ServiceError(errors.MY_CUSTOM_ERROR, {
	msgParams: ["Foo"]
});

assert.equal(error.getMessage(),
      "Reason: Foo");
```

An error can be assigned to a field.

```js
var error = new SDKError.ServiceError(errors.MY_CUSTOM_ERROR, "someField", {
	msgParams: ["Foo"]
});
```

You can use ErrorCollection to manage errors.

```js
var errors = new SDKError.ErrorCollection();

var error = new SDKError.ServiceError(errors.MY_CUSTOM_ERROR, "someField", {
	msgParams: ["Foo"]
});

errors.addError(error);

assert.equal(errors.hasError(errors.MY_CUSTOM_ERROR, "someField"),
		true);
```