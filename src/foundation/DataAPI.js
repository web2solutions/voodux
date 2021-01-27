// import Dexie from 'dexie'
import mongoose from 'mongoose'
import { createMethodSignature, GUID, toJSON } from './utils'

/**
 * @author Eduardo Perotta de Almeida <web2solucoes@gmail.com>
 * @Class DataAPI
 * @description Models Data API
 * @extends Data
 * @extends DataTransportLocal
 * @param  {object} config - Configuration factory
 * @param  {string} config.foundation - Provide Accesss to Foundation scope
 * @param  {string} config.entity - Data entity which the created object is handling
 * @param  {boolean} config.strategy - Data transport strategy
 * @param  {boolean} config.schema - Access to related data schema
 * @example
    const dataAPI = new DataAPI({
      foundation ,   // Foundation instance, object
      entity,         // entity name, string
      strategy,       // data strategy, string
      schema           // data schema, mongoose schema
    })
 */

export default class DataAPI {

  #foundation
  #database
  #entity
  #strategy
  #schema
  #pagination

  constructor ({ foundation, entity, strategy, schema } = {}) {
    
    this.#entity = entity
    this.#strategy = strategy // offlineFirst, onlineFirst, offline, online
    this.#schema = schema
    this.#foundation = foundation
    this.#pagination = {
      offset: 0,
      limit: 30
    }

    // this.#database = this.#foundation.database

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

    foundation.localDatabaseTransport.addSchema(this.#entity, this.#schema)

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

  static mongoose() {
    return mongoose;
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
  async add (doc = {}) {
    let data = null
    let error = null
    let rawObj = {}
    try {
      const model = new this.Model(doc, this.#schema)
      const invalid = model.validateSync()
      if (invalid)
      {
        throw invalid
      }
      rawObj = toJSON(model)
      const __id = await this.#foundation.localDatabaseTransport.table(this.#entity).add({...rawObj})
      data = { __id, ...rawObj }
    } catch (e) {
      error = e
    }
    this.#foundation.triggerEvent(`collection:add:${this.#entity.toLowerCase()}`, {
      foundation: this.#foundation,
      entity: this.#entity,
      document: rawObj,
      data,
      error,
    })

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
   * @param  {object} pagination - Pagination object. If not provided will assume internaly set pagination.
   * @param  {number} pagination.offset - Offset. Default 0.
   * @param  {number} pagination.limit - Limit. Default 30.
   * @example
        User.find({
          $or: [{ age: { $lt: 23, $ne: 20 } }, { lastname: { $in: ['Fox'] } }]
        })
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {array} signature.data - Array of Found documents
   */
  async find(query = {}, pagination = this.#pagination) {
    let { offset, limit } = pagination
    let data = null
    let error = null
    try {
      const documents = await this.#foundation
          .localDatabaseTransport
            .collection(this.#entity)
              .find(query)
                .offset(offset)
                  .limit(limit)
                    .toArray()       
      data = documents
    } catch (e) {
      error = e
    }
    return createMethodSignature(error, data)
  }

  /**
   * @async
   * @Method DataAPI.count
   * @description count all documents based on the given query
   * @param  {object} query - The query object to count documents
   * @example
        User.count({
          $or: [{ age: { $lt: 23, $ne: 20 } }, { lastname: { $in: ['Fox'] } }]
        })
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {number} signature.data - Documents counter
   */
  async count (query = {}) {
    let data = null
    let error = null
    try {
      const counter = await this.#foundation
          .localDatabaseTransport
            .collection(this.#entity)
              .count(query)     
      data = counter
    } catch (e) {
      error = e
    }
    return createMethodSignature(error, data)
  }
}
