function type (definition) {
  return function Type (data = {}) {
    const definitionCopy = Object.assign({}, definition)

    // Set all defined properties (and their values) on `this`
    for (const [propKey, propType] of Object.entries(definitionCopy)) {
      let propValue = data[propKey]

      if (propHasDefault(propType)) {
        const [type, defaultValue] = parsePropDefault(propType)

        // If no value is passed, set default
        if (typeof propValue === 'undefined') {
          propValue = defaultValue
        }

        // Overwrite the arrow function with the defined type
        definitionCopy[propKey] = type
      }

      this[propKey] = propValue
    }

    // Run constructor
    if (typeof definitionCopy.constructor === 'function') {
      definitionCopy.constructor.call(this, data)
      delete definitionCopy.constructor
    }

    // Validate property types
    for (const [propKey, propType] of Object.entries(definitionCopy)) {
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

function propHasDefault (propType) {
  if (typeof propType !== 'function') {
    return false // Defaults are set using a function
  }

  const fnString = propType.toString()

  if (fnString.startsWith('function')) {
    return false // Defaults are set using an arrow function, this is a "regular" function
  }

  if (!fnString.includes('=>')) {
    return false // Arrow functions always include '=>'
  }

  return true
}

function parsePropDefault (fn) {
  const typeString = fn.toString()
    .split('=>')[0] // Get the part before the =>
    .replace(/[()\[\] ]/g, '') // Remove syntax characters

  const multiple = typeString.includes(',')

  const type = multiple
    ? typeString.split(',').map(t => global[t])
    : global[typeString]

  const value = fn.call(this, type)

  return [type, value]
}

module.exports = { type }
