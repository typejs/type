# TypeJS

A simple way to add runtime type safety to your JavaScript project.

```js
const Pizza = type({
  price: Number,
  pineapple: Boolean => false
})

new Pizza({ price: '9.99' })
// TypeError: Value for `price` has an invalid type.
```

## Default values

You can specify a default value for a property:

```js
const Pizza = type({
  topping: String => 'cheese'
})

const pizza = new Pizza() 
pizza.topping // 'cheese'
```

This syntax only works for primitive values (string, number, array, etc.). When using an instance of a class as default value, set them in the constructor:

```js
const Pizza = type({
  price: Money,

  constructor () {
    this.price ??= new Money(9.99)
  }
})

const pizza = new Pizza() 
pizza.price // Money 9.99
```

## Nullable properties

You can make a property nullable by setting `null` as default value:

```js
const Pizza = type({
  addons: Array => null
})

const pizza = new Pizza() 
pizza.addons // null
```

## Multiple types

You can allow multiple types for a property:

```js
const Pizza = type({
  price: [Number, String]
})
```

## Complete example

You can allow multiple types for a property:

```js
const Pizza = type({
  // Simple primitive type
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
