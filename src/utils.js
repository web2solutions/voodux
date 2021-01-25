/** @module utils */

/**
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
 * generates a Universally unique identifier string - alias to uuid()
 * @function
 * @return  {string} guid / uuid
 */
export const GUID = () => {
  return uuid()
}

/**
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
 * toJSON
 * @function
 * @return  {object} stringify and parse an object
 */
export function toJSON (obj = {}) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * mongooseToDexieTableString
 * convert given Mongoose schema to a Dexie Table columns configuration. <br>
 * All columns inside returned configuration are indexed at IndexedDB
 * prepend __id as local primary key and _id for remote primary key
 * @function
 * @return  {string} guid / uuid
 */
export function mongooseToDexieTableString (schema) {
  const cols = []
  for (const propertyName in schema.paths) {
    if (Object.prototype.hasOwnProperty.call(schema.paths, propertyName)) {
      const property = schema.paths[propertyName]
      const {
        instance,
        _index,
        isRequired
      } = property
      // console.debug(propertyName, property)
      if (propertyName === '_id' || propertyName === '__id') {
        continue
      }
      cols.push(propertyName)
    }
  }
  return `++__id,_id,${cols.join(',')}`
}
