# type

A simple function to add runtime type safety to your JavaScript objects.

<a href="https://www.npmjs.com/package/@typejs/type" target="_blank"><img src="https://img.shields.io/npm/v/@typejs/type?label=stable&style=flat-square" alt="Version"></a>
<a href="https://github.com/typejs/type/actions" target="_blank"><img src="https://img.shields.io/github/actions/workflow/status/typejs/type/test.yml?branch=main&label=tests&style=flat-square" alt="Tests"></a>
<a href="https://github.com/typejs/type/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/@typejs/type?style=flat-square" alt="License"></a>

```js
const Pizza = type({
  price: Number,
  pineapple: Boolean => false
})

new Pizza({ price: '9.99' })
// TypeError: The value for property `price` has an invalid type.
```

## Install
```bash
npm install @typejs/type
```

## Use
```js
import { type } from '@typejs/type'
```

## Default values

Specify a default value for a property:

```js
const Pizza = type({
  topping: String => 'cheese'
})

const pizza = new Pizza() 
pizza.topping // 'cheese'
```

> For non-primitive types, set defaults in the [constructor](#constructor)

## Nullable properties

Make a property nullable by setting `null` as default value:

```js
const Pizza = type({
  addons: Array => null
})

const pizza = new Pizza() 
pizza.addons // null
```

## Multiple types

Allow multiple types for a property:

```js
const Pizza = type({
  price: [Number, String],
  notes: ([String, Array]) => 'No pineapple'
})
```

## Constructor

Create a constructor to provide any custom initialization.
For example to set defaults for class typed properties:

```js
const Pizza = type({
  price: Money,

  constructor ({ discount = 0 }) {
    this.price ??= new Money(9.99 - discount)
  }
})

const pizza = new Pizza({ discount: 2.00 })
pizza.price // Money 7.99
```

## Complete example

```js
const Pizza = type({
  // Primitive type
  name: String,

  // Class type
  price: Money,
  
  // Multiple allowed types
  ingredients: [Array, String],

  // Default value
  topping: Boolean => 'cheese',

  // Nullable value
  addons: Array => null,

  // Default value for class typed properties
  constructor () {
    this.price ??= new Money(9.99)
  }
})
```
