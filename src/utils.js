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
 * Create default signature method object
 * @private
 * @param {string|object} error - The string or error object if have any
 * @param {object|array|number|string|boolean} data - Information about method execution
 * @return  {object} signature - Default methods signature format { error, data }
 * @return  {string|object} signature.error - Execution error
 * @return  {object|array|number|string|boolean} signature.data - Execution data
 */

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
