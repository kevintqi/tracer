# Node.js SDK Couchbase

## Installation

First install **Node.js 6.x**. Then:

```sh
$ npm install sdk-node-couchbase
```

## Overview

### Connecting your model to couchbase

We can use the couchbase connector to extend the behavior of our `Model` interface.

```js
var Couchbase = require("sdk-node-couchbase");
var Model = require("sdk-node-model");

var Person = Model.extend("Person", {
	options: {

	},
	attributes: {
		name: {
			type: "string",
			options: {length: 30}
		},
		age: {
			type: "number",
			options: {max: 100}
		}				
	}
});

Couchbase.connect({server: "couchbase://localhost/"});

Person = Couchbase.extend(Person);
```

We can now use `save` to persist our model.

```js
var person = new Person({
	name: "foo",
	age: 21
});

person.save().then((result) => {
	Person.findOne(person.id).then((result) => {
		console.log(result);
	}).catch(err => {
		throw err;
	});
}).catch(err => {
	throw err;
});
```


### Remove

Removing an entity using the instance object.

```js
var person = new Person({
	name: "foo",
	age: 21
});

person.save().then((result) => {
	person.destroy().then((result) => {
	}).catch(err => {
		throw err;
	});
}).catch(err => {
	throw err;
});
```

Using the static method.

```js
Person.destroy(id).then(() => {
	//do something
}).catch(err => {
	throw err;
});
```