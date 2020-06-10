// Copyright 2014 Andrei Karpushonak

'use strict'

const ECMA_SIZES = require('./byte_size')
const Buffer = require('buffer').Buffer
let currentSymbol

function sizeOfObject (object) {
  if (object == null) {
    return 0
  }
  if (object[currentSymbol]) {
    return ECMA_SIZES.REFERENCE
  }

  object[currentSymbol] = true

  if (object instanceof Map) {
    return sizeofRec(Array.from(object))
  }
  return sizeofRec(Object.entries(object))
}

/**
 * Main module's entry point
 * Calculates Bytes for the provided parameter
 * @param object - handles object/string/boolean/buffer
 * @returns {*}
 */
function sizeof (object) {
  currentSymbol = Symbol()
  return sizeofRec(object)
}

function sizeofRec (object) {
  if (Buffer.isBuffer(object)) {
    return object.length
  }

  const objectType = typeof (object)
  switch (objectType) {
    case 'string':
      return object.length * ECMA_SIZES.STRING
    case 'boolean':
      return ECMA_SIZES.BOOLEAN
    case 'number':
      return ECMA_SIZES.NUMBER
    case 'object':
      if (Array.isArray(object)) {
        return object.map(sizeofRec).reduce(function (acc, curr) {
          return acc + curr
        }, 0)
      } else {
        return sizeOfObject(object)
      }
    default:
      return 0
  }
}

module.exports = sizeof
