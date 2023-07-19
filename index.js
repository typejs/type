function type (definition) {
  return function Type (data = {}) {
    // Set properties on `this`
    for (const [propKey, propType] of Object.entries(definition)) {
      let propValue = data[propKey]

      if (typeof propType === 'function') {
        const functionString = propType.toString()

        if (isArrowFunction(functionString)) {
          if (typeof propValue === 'undefined') {
            propValue = propType()
          }

          const parsedType = functionString.split(' => ')[0]

          definition[propKey] = global[parsedType]
        }
      }

      this[propKey] = propValue
    }

    // Run constructor
    if (typeof definition.constructor === 'function') {
      definition.constructor.apply(this)
    }

    // Validate
    for (const [propKey, propType] of Object.entries(definition)) {
      if (propKey === 'constructor') {
        continue
      }

      const propValue = this[propKey]

      const valid = Array.isArray(propType)
        ? propType.some(t => validateType(t, propValue))
        : validateType(propType, propValue)

      if (typeof propValue === 'undefined' && !valid) {
        throw new TypeError(`Required property \`${propKey}\` is missing.`)
      }

      if (!valid) {
        throw new TypeError(`The value for property \`${propKey}\` has an invalid type.`)
      }
    }
  }
}

function validateType (type, value) {
  switch (type) {
    case Boolean: return typeof value === 'boolean'
    case String: return typeof value === 'string'
    case Number: return typeof value === 'number'
    case Function: return typeof value === 'function'
    case Symbol: return typeof value === 'symbol'
    case undefined: return typeof value === 'undefined'
    case null: return value === null

    default: return value instanceof type
  }
}

function isArrowFunction (string) {
  return string.includes(' => ') && !string.startsWith('function')
}

module.exports = { type }
