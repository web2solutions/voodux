import DataTransportLocal from './DataTransportLocal'




/**
 * @Class Data
 * @description Bootstrap class data for DataAPI
 */
class Data {}



/**
 * @Class DataAPI
 * @description Models Data API
 * @extends Data
 * @extends DataTransportLocal
 * @param  {object} config - Configuration factory
 * @param  {string} config.application - Provide Accesss to Application scope
 * @param  {string} config.entity - Data entity which the created object is handling
 * @param  {boolean} config.strategy - Data transport strategy
 * @param  {boolean} config.model - Access to related data model
 */

export default class DataAPI extends DataTransportLocal(Data) {

  #application
  #entity
  #strategy
  #model
  
  constructor ({ application, entity, strategy, model } = {}) {
    super()
    this.#entity = entity
    this.#strategy = strategy // offlineFirst, onlineFirst, offline, online
    this.#model = model
    this.#application = application

  }

  get entity () {
    return this.#entity
  }

  get model () {
    return this.#model
  }

  get strategy () {
    return this.#strategy
  }

  /**
   * @Method DataAPI.add
   * @description add a new document to the storage
   * @param  {object} doc - A valid document validated against mongoose model
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Created document
  */
  async add (doc) {
    // xxxx
    console.log(this.#entity, this.#strategy)
  }

  /**
   * @Method DataAPI.edit
   * @description Edit a document on the storage
   * @param  {string|number} identifier - The primary key value of the desired document
   * @param  {object} doc - A valid document validated against mongoose model
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Edited document
   */
  async edit (identifier, doc) {
    // todo
    console.log(this.#entity, this.#strategy)
  }

  /**
   * @Method DataAPI.delete
   * @description delete a document from the storage
   * @param  {string|number} identifier - The primary key value of the desired document
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Deleted document
   */
  async delete (identifier) {
    // todo
    console.log(this.#entity, this.#strategy)
  }

  /**
   * @Method DataAPI.findById
   * @description find a document from the storage by ID
   * @param  {string|number} identifier - The primary key value of the desired document
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Found document
   */
  async findById (identifier) {
    // todo
    console.log(this.#entity, this.#strategy)
  }

  /**
   * @Method DataAPI.findAll
   * @description find all documents
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {array} signature.data - Array of Found documents
   */
  async findAll () {
    // todo
    console.log(this.#entity, this.#strategy)
  }

  /**
   * @Method DataAPI.find
   * @description find all documents based on the given query
   * @param  {object|null} query - The query object to search documents
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {array} signature.data - Array of Found documents
   */
  async find (query) {
    // todo
    console.log(this.#entity, this.#strategy)
  }
}
