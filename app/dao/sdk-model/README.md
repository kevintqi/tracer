# Node.js SDK Model

## Installation

First install **Node.js 6.x**. Then:

```sh
$ npm install sdk-node-model
```

## Overview

### Defining a Model

Models are defined through the `Model` interface.

```js
let Todo = Model.extend("Todo", {
	options: {

	},
	attributes: {
		name: {
			type: "string",
			options: {maxLength: 30, allowEmpty: false}
		},
		description: {
			type: "string",
			options: {maxLength: 100}
		},
		dueDate: {
			type: "date",
			options: {
				default: Date.now;
			}
		},
		completed: {
			type: "boolean"
		}
	}
});
```

Once we have our model, we can then instantiate it.

```js
let todoItem = new Todo();
todoItem.name = "foo"
```

We can also instantiate our model with values.

```js
let todoItem = new Todo({
	name: "foo",
	description: "bar"
});
```

### Model Methods

We can add behaviors to our model.

```js
let People = Model.extend("Person", {
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
		}
	},
	methods: {
		isOver18: function() {
			return this.age >= 18;
		}
	}
});

var tom = new People({
	name: "tom",
	age: 30
});

should(tom.isOver18()).be.true();
```

### Model ID

You can declare your own custom ID.

```js
let People = Model.extend("Person", {
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
		}
	},
	methods: {
		isOver18: function() {
			return this.age >= 18;
		}
	}
});

var tom = new People({
	id: '123-145-789',
	name: "tom",
	age: 30
});

```