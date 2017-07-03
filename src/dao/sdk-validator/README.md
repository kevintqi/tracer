
# Node.js SDK Validation

## Installation

First install **Node.js 6.x**. Then:

```sh
$ npm install sdk-node-validator
```

## Overview

### Built-in Validators

Numbers have min and max validators.

Strings have maxLength and allowEmpty validators.

```js
let Phone = Model.extend("Phone", {
	options: {

	},
	attributes: {
		provider: {
			type: "string",
			options: {maxLength: 30, allowEmpty: false}
		},
		phone: {
			type: "number",
			options: {
				min: 10
				max: 10
			}
		}
	}
});

let myPhone = new Phone({
	provider: "att",
	phone: 55555555567
});

assert.equal(myPhone.errors["phone"].getMessage(),
      "number is greater than max: 10");
```

### Custom validators

You can define custom validators by extending the Validator class

```js
var Validator = require("../validator"),
    SDKError = require("sdk-node-error"),
    _ = require("lodash");

var errors = SDKError.errors;

module.exports = class MyCustomValidator extends Validator {
	constructor(path, options) {
		super(path, options);
	}

	validate(value) {
		if (/\d{5}/.test(value)) {
			return this.addError(errors.MyCustomError);
		}

		return value;
	}
};
```

**TO BE IMPLEMENTED**

Validators can also declare a custom validator in the schema.

```js
let Phone = Model.extend("Phone", {
	options: {

	},
	attributes: {
		provider: {
			type: "string",
			options: {maxLength: 30, allowEmpty: false}
		},
		phone: {
			type: "number",
			validator: {
				validate: function(val) {
					if (/\d{3}-\d{3}-\d{4}/.test(value)) {
						return this.addError(errors.BAD_PHONE_NUMBER);
					}

					return val;
				}
			}
		}
	}
});
```