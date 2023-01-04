function type (definition) {
  const properties = Object.entries(definition)

  return function Type (data = {}) {
    for (let [propKey, propType] of properties) {
      let propValue = data[propKey]

      if (typeof propType === 'function') {
        const functionString = propType.toString()

        if (isArrowFunction(functionString)) {
          if (typeof propValue === 'undefined') {
            propValue = propType()
          }

          const parsedType = functionString.split(' => ')[0]
          propType = global[parsedType]
        }
      }

      const valid = Array.isArray(propType)
        ? propType.some(t => validateType(t, propValue))
        : validateType(propType, propValue)

      if (typeof propValue === 'undefined' && !valid) {
        throw new TypeError(`Required property ${propKey} missing.`)
      }

      if (!valid) {
        throw new TypeError(`Value for ${propKey} has an invalid type.`)
      }

      this[propKey] = data[propKey]
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
    case Null: return value === null

    default: return value instanceof type
  }
}

function isArrowFunction (string) {
  return string.includes(' => ') && !string.startsWith('function')
}

function Null () {
  //
}

module.exports = { type, Null }
