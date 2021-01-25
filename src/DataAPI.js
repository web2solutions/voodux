// import Dexie from 'dexie'
import mongoose from 'mongoose'
import { createMethodSignature, GUID, toJSON } from './utils'

/**
 * @Class DataAPI
 * @description Models Data API
 * @extends Data
 * @extends DataTransportLocal
 * @param  {object} config - Configuration factory
 * @param  {string} config.application - Provide Accesss to Application scope
 * @param  {string} config.entity - Data entity which the created object is handling
 * @param  {boolean} config.strategy - Data transport strategy
 * @param  {boolean} config.schema - Access to related data schema
 * @example
    const dataAPI = new DataAPI({
      application ,   // Application instance, object
      entity,         // entity name, string
      strategy,       // data strategy, string
      schema           // data schema, mongoose schema
    })
 */

export default class DataAPI {

  #application
  #database
  #entity
  #strategy
  #schema
  
  constructor ({ application, entity, strategy, schema } = {}) {
    
    this.#entity = entity
    this.#strategy = strategy // offlineFirst, onlineFirst, offline, online
    this.#schema = schema
    this.#application = application
    
    // this.#database = this.#application.database

    /* console.error(this.#schema)
    console.error(this.#schema.obj)
    console.error(this.#schema.obj.name.type)
    console.error(this.#schema.obj.name.type())
    console.error(this.#schema.obj.name.type().name) */
    // console.error(this.#schema.paths)


    // console.error(Object.keys(this.#schema.paths))
    // console.error(this.mongooseToDexieTableString())
    /* this.version(1).stores({
      [this.#entity]: this.mongooseToDexieTableString(),
    }); */

    application.localDatabaseTransport.addSchema(this.#entity, this.#schema)

  }


  /* mongooseToDexieTableString () {
    const cols = []
    for (const propertyName in this.#schema.paths) {
      if (Object.prototype.hasOwnProperty.call(this.#schema.paths, propertyName)) {
        const property = this.#schema.paths[propertyName]
        const { instance, _index, isRequired } =  property
        // console.debug(propertyName, property)
        if (propertyName === '_id' || propertyName === '__id')
        {
          continue
        }
        cols.push(propertyName)
      }
    }
    return `++__id,_id,${cols.join(',')}`
  } */

  get entity () {
    return this.#entity
  }

  get schema () {
    return this.#schema
  }

  get strategy () {
    return this.#strategy
  }

  Model(doc, schema) {
    const modelSystem = mongoose.Document
    modelSystem.prototype.isValid = () =>  modelSystem.prototype.validateSync
    return modelSystem(doc, schema)
  }
  /**
   * @async
   * @Method DataAPI.add
   * @description add a new document to the storage
   * @param  {object} doc - A valid document validated against mongoose schema
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Created document
  */
  async add(doc = {}) {
    let data = null
    let error = null
    try {
      const model = new this.Model(doc, this.#schema)
      const invalid = model.validateSync()
      if (invalid)
      {
        throw invalid
      }
      const rawObj = toJSON(model)
      const __id = await this.#application.localDatabaseTransport.table(this.#entity).add({...rawObj})
      console.log(this.#application.localDatabaseTransport)
      console.log(this.#entity, this.#application.localDatabaseTransport[this.#entity])
      console.log(this.#entity, this.#application.localDatabaseTransport.table(this.#entity))
      data = { __id, ...rawObj }
    } catch (e) {
      error = e
    }
    return createMethodSignature(error, data)
  }

  /**
   * @async
   * @Method DataAPI.edit
   * @description Edit a document on the storage
   * @param  {string|number} identifier - The primary key value of the desired document
   * @param  {object} doc - A valid document validated against mongoose schema
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Edited document
   */
  async edit (identifier, doc) {
    // todo
    console.log(this.#entity, this.#strategy)
  }

  /**
   * @async
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
   * @async
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
   * @async
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
   * @async
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
