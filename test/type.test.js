import { describe, expect, it } from 'vitest'

import { type } from '../'

describe('type', () => {
  it('can be created', () => {
    const Pizza = type({
      pineapple: Boolean
    })

    const hawaiian = new Pizza({ pineapple: true })

    expect(hawaiian).toBeInstanceOf(Pizza)
  })

  it('sets the given properties', () => {
    const Pizza = type({
      pineapple: Boolean,
      topping: String
    })

    const hawaiian = new Pizza({
      pineapple: true,
      topping: 'cheese'
    })

    expect(hawaiian.pineapple).toBe(true)
    expect(hawaiian.topping).toBe('cheese')
  })

  it('omits additional given properties', () => {
    const Pizza = type({
      pineapple: Boolean
    })

    const hawaiian = new Pizza({
      pineapple: true,
      extra: 'cheese'
    })

    expect(hawaiian.pineapple).toBe(true)
    expect(hawaiian.extra).toBeUndefined()
  })

  it('throws a TypeError when a required property is missing', () => {
    const Pizza = type({
      topping: String
    })

    expect(() => new Pizza()).toThrowError('Required property')
  })

  it('throws a TypeError when instantiated with a wrong type', () => {
    const Pizza = type({
      pineapple: Boolean
    })

    expect(() => new Pizza({ pineapple: 'no thanks' })).toThrowError(TypeError)
  })

  describe('type checks', () => {
    it('checks booleans', () => {
      const Pizza = type({
        pineapple: Boolean
      })

      expect(() => new Pizza({ pineapple: 'yes' })).toThrowError('invalid type')
      expect(() => new Pizza({ pineapple: true })).not.toThrowError()
    })

    it('checks strings', () => {
      const Pizza = type({
        topping: String
      })

      expect(() => new Pizza({ topping: true })).toThrowError('invalid type')
      expect(() => new Pizza({ topping: 'cheese' })).not.toThrowError()
    })

    it('checks numbers', () => {
      const Pizza = type({
        price: Number
      })

      expect(() => new Pizza({ price: '9.99' })).toThrowError('invalid type')
      expect(() => new Pizza({ price: 9.99 })).not.toThrowError()
    })

    it('checks functions', () => {
      const Pizza = type({
        callback: Function
      })

      expect(() => new Pizza({ callback: false })).toThrowError('invalid type')
      expect(() => new Pizza({ callback: () => { } })).not.toThrowError()
    })

    it('checks arrays', () => {
      const Pizza = type({
        ingredients: Array
      })

      expect(() => new Pizza({ ingredients: 'Dough, Tomato sauce' })).toThrowError('invalid type')
      expect(() => new Pizza({ ingredients: { dough: true } })).toThrowError('invalid type')
      expect(() => new Pizza({ ingredients: ['Dough', 'Tomato sauce'] })).not.toThrowError()
    })

    it('checks symbols', () => {
      const Pizza = type({
        sym: Symbol
      })

      expect(() => new Pizza({ sym: 'I am not a symbol' })).toThrowError('invalid type')
      expect(() => new Pizza({ sym: Symbol('I am a symbol') })).not.toThrowError()
    })

    it('checks constructor functions / classes', () => {
      class Money { }

      const Pizza = type({
        price: Money
      })

      expect(() => new Pizza({ price: 6.99 })).toThrowError('invalid type')
      expect(() => new Pizza({ price: new Money() })).not.toThrowError()
    })

    it('checks other types', () => {
      const Money = type({
        value: Number
      })

      const Pizza = type({
        price: Money
      })

      expect(() => new Pizza({ price: 16.99 })).toThrowError('invalid type')
      expect(() => new Pizza({ price: new Money({ value: 6.99 }) })).not.toThrowError()
      expect(() => new Pizza({ price: new Money({ value: '6.99' }) })).toThrowError('invalid type')
    })
  })

  it('allows multiple types', () => {
    const Pizza = type({
      price: [Number, String]
    })

    expect(() => new Pizza({ price: '7.99' })).not.toThrowError()
    expect(() => new Pizza({ price: 7.99 })).not.toThrowError()
    expect(() => new Pizza({ price: false })).toThrowError()
  })

  it('allows nullable types', () => {
    const Pizza = type({
      size: [String, null]
    })

    expect(() => new Pizza({ size: null })).not.toThrowError()
    expect(() => new Pizza({ size: 'XL' })).not.toThrowError()
    expect(() => new Pizza({ size: 100 })).toThrowError()
    expect(() => new Pizza({ size: undefined })).toThrowError()
    expect(() => new Pizza()).toThrowError()
  })

  describe('optional types / default values', () => {
    it('allows optional types via undefined keyword', () => {
      const Pizza = type({
        topping: [String, undefined]
      })

      expect(() => new Pizza()).not.toThrowError()
      expect(() => new Pizza({ topping: 'tomatoes' })).not.toThrowError()
      expect(() => new Pizza({ topping: false })).toThrowError()
    })

    it('allows to set defaults in the constructor', () => {
      class Money {
        constructor (value) {
          this.value = value
        }
      }

      const Pizza = type({
        price: Money,

        constructor () {
          this.price ??= new Money(3.99)
        }
      })

      expect(() => new Pizza()).not.toThrowError()

      const cheapPizza = new Pizza()
      expect(cheapPizza.price.value).toBe(3.99)

      const expensivePizza = new Pizza({ price: new Money(19.99) })
      expect(expensivePizza.price.value).toBe(19.99)
    })

    it('allows to set default values using the shorthand for primitives', () => {
      const Pizza = type({
        topping: String => 'cheese'
      })

      expect(() => new Pizza()).not.toThrowError()
      expect(() => new Pizza({ topping: 'tomatoes' })).not.toThrowError()
      expect(() => new Pizza({ topping: false })).toThrowError()
    })

    it('throws when the default value has a wrong type', () => {
      const Pizza = type({
        topping: String => 100
      })

      expect(() => new Pizza()).toThrowError()
      expect(() => new Pizza({ topping: 'tomatoes' })).not.toThrowError()
    })

    it('allows passing additional arguments to the constructor', () => {
      const Pizza = type({
        price: Number,

        constructor ({ discount = 0 }) {
          this.price -= discount
        }
      })

      const pizza = new Pizza({ price: 9.99, discount: 2.00 })

      expect(pizza.price).toBe(7.99)
      expect(pizza.discount).not.toBeDefined()
    })
  })
})
