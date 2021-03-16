/* global lunr */
import lunr from 'lunr'
import mongoose from 'mongoose'
// const lunr = require('lunr')
// console.debug('<>><><><<>><><><><><><><', lunr)
/**
 * @author Eduardo Perotta de Almeida <web2solucoes@gmail.com>
 * @module utils
 * */

/**
 * createMethodSignature
 * Create default signature method object
 * @function
 * @param {string|object} error - The string or error object if have any
 * @param {object|array|number|string|boolean} data - Information about method execution
 * @return  {object} signature - Default methods signature format { error, data }
 * @return  {string|object} signature.error - Execution error
 * @return  {object|array|number|string|boolean} signature.data - Execution data
 */
export const createMethodSignature = (error = null, data = null) => {
  return { error, data }
}

/**
 * uuid
 * generates a Universally unique identifier string
 * @function
 * @return  {string} guid / uuid
 */
export function uuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * genDbName
 * generates a database name
 * @function
 * @param {string} appName - Voodux Application Instance name
 * @return  {string} dbName / uuid
 */
export function genDbName(appName = '') {
  appName = appName.toLowerCase().replace(/ /g, '_')
  const dbName = `VooduX_${appName}`
  return dbName
}


/**
 * toJSON -  stringify and parse an object<br> It uses native JSON internally.
 * @function
 * @param {string|object} obj - Valid JSON object or string
 * @return  {object} new JSON object
 */
export function toJSON (obj = '') {
  if (typeof obj === 'string') {
    return JSON.parse(obj)
  }
  return JSON.parse(JSON.stringify(obj))
}

/**
 * mongooseToDexieTableString
 * convert given Mongoose schema to a Dexie Table columns configuration. <br>
 * All columns inside returned configuration are indexed at IndexedDB
 * prepend __id as local primary key and _id for remote primary key
 * Local primary key is integer and auto incremented
 * @function
 * @return  {string} Dexie table configuration string
 */
export function mongooseToDexieTableString(schema) {
  // console.log('XXXXXXX mongooseToDexieTableString')
  const cols = []
  const notIndexed = []
  for (let propertyName in schema.paths) {
    if (Object.prototype.hasOwnProperty.call(schema.paths, propertyName)) {
      const property = schema.paths[propertyName]
      // instance is type
      // _index can be boolean or object  {unique: true}
      // options { default, index, required, unique }
      const { instance,  _index, options: { unique = false }, /* isRequired */ } = property
      if (propertyName === '_id' || propertyName === '__id') {
        continue
      }
      if (!_index) {
        notIndexed.push(propertyName)
        continue
      }
      if (instance === 'Array') {
        propertyName = `*${propertyName}`// * is MultiEntry Index on Dexie
      }
      if (unique) {
        propertyName = `&${propertyName}` // & is unique Index on Dexie
      }
      cols.push(propertyName)
    } // end if has property
  }// end for

  const compoundIndexes = getCompoundIndexes(notIndexed, schema)

  if (compoundIndexes.length > 0) {
    // console.log(`++__id,_id,${compoundIndexes.join(',')}${cols.length > 0 ? (',' + cols.join(',')) : ''}`)
    return `++__id,_id,${compoundIndexes.join(',')}${cols.length > 0 ? (',' + cols.join(',')) : ''}`
  } else {
    // console.log(`++__id,_id${cols.length > 0 ? ',' + cols.join(',') : ''}`)
    return `++__id,_id${cols.length > 0 ? ',' + cols.join(',') : ''}`
  }
}

/**
 * getCompoundIndexes
 * @summary PRIVATE getCompoundIndexes() - get compound indexes in a schema
 * @description 
 * Compound keys are NOT initially indexed on schema property level,<br> 
 * then we need to iterate over schema._index[0], which is the arrray containing all indexes including the compounds
 * @function
 * @param {array} notIndexed - name of not indexes columns/properties.
 * @param {object} schema - data schema object instance
 * @return {array} compoundIndexes
 */
function getCompoundIndexes(notIndexed, schema) {
  let compoundIndexes = []
  const compoundKeys = []
  // console.error('>>>>>>>>>>>> schema._indexes.length', schema._indexes.length)
  if (schema._indexes.length === 0) {
    return compoundIndexes
  }
  for (let x = 0; x < notIndexed.length; x++) {
    const propertyName = notIndexed[x]
    // check if this property is listed on compoundKeys
    if (compoundKeys.indexOf(propertyName) > -1) {
      continue
    }
    // console.error('>>>>>>>>>>>>', schema._indexes)
    const __indexes = schema._indexes[0] // get array of indexes
    for (let y = 0; y < __indexes.length; y++) {
      const _index = __indexes[y]
      const keys = Object.keys(_index)
      // if property is a key of current _index then it is compound
      if (keys.indexOf(propertyName) > -1) {
        compoundIndexes.push(`[${keys[0]}+${keys[1]}]`)
        keys.forEach(k => (compoundKeys.push(k)))
        // we already built  the compound index, 
        // there is no need to continue to iterate over __indexes
        break 
      }
    }
    // remove keys from notIndexed array if  it is component
  }
  return compoundIndexes
}

/**
 * getSearchTokenStream
 * generates a lunr search token. See {@link https://lunrjs.com/guides/searching.html|lunr search}
 * @function
 * @return {array} token
 */
export function getSearchTokenStream(text = '') {
  // console.log('xxxxxxxxx')
  // console.log('xxxxxxxxx', index)
  // const index = lunr()
  // return index.pipeline.run(lunr.tokenizer(text))
  const token = (lunr.tokenizer(text)).map(t => (t.str))
  return token
  // return lunr.tokenizer(text)
}

export const Schema = mongoose.Schema


export function ArrayObserver (a) {
  let _this = this
  this.array = a
  this.observers = []

  this.Observe = function (notifyCallback) {
    _this.observers.push(notifyCallback)
  }

  a.push = function (obj) {
    let push = Array.prototype.push.apply(a, arguments)
    for (let i = 0; i < _this.observers.length; i++) {
      _this.observers[i](obj, 'push')
    }
    return push
  }

  a.pop = function () {
    let popped = Array.prototype.pop.apply(a, arguments)
    for (let i = 0; i < _this.observers.length; i++) {
      _this.observers[i](popped, 'pop')
    }
    return popped
  }

  a.reverse = function () {
    let result = Array.prototype.reverse.apply(a, arguments)
    for (let i = 0; i < _this.observers.length; i++) {
      _this.observers[i](result, 'reverse')
    }
    return result
  }

  a.shift = function () {
    let deleted_item = Array.prototype.shift.apply(a, arguments)
    for (let i = 0; i < _this.observers.length; i++) {
      _this.observers[i](deleted_item, 'shift')
    }
    return deleted_item
  }

  a.sort = function () {
    let result = Array.prototype.sort.apply(a, arguments)
    for (let i = 0; i < _this.observers.length; i++) {
      _this.observers[i](result, 'sort')
    }
    return result
  }

  a.splice = function (i, length, itemsToInsert) {
    let returnObj = ''
    if (itemsToInsert) {
      Array.prototype.slice.call(arguments, 2)
      returnObj = itemsToInsert
    } else {
      returnObj = Array.prototype.splice.apply(a, arguments)
    }
    for (let i = 0; i < _this.observers.length; i++) {
      _this.observers[i](returnObj, 'splice')
    }
    return returnObj
  }

  a.unshift = function () {
    let new_length = Array.prototype.unshift.apply(a, arguments)
    for (let i = 0; i < _this.observers.length; i++) {
      _this.observers[i](new_length, 'unshift')
    }
    return arguments
  }
}

