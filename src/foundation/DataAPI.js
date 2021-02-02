/* global localStorage, navigator, window */

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

  #_foundation
  #_entity
  #_strategy
  #_schema
  #_pagination
  #_stateChangeStorageName

  constructor ({ foundation, entity, strategy, schema } = {}) {
    
    this.#_entity = entity
    this.#_strategy = strategy // offlineFirst, onlineFirst, offline, online
    this.#_schema = schema
    this.#_foundation = foundation
    this.#_pagination = {
      offset: 0,
      limit: 30
    }
    this.#_stateChangeStorageName = `__$tabEntityStateChange_${this.#_entity}`
    
    this.#_foundation.localDatabaseTransport.addSchema(this.#_entity, this.#_schema)
    
    this.#_listenToAllOtherTabsStateChanges()
  }

  /**
   * @memberof DataAPI.entity
   * @member {getter} DataAPI.entity
   * @example console.log(DataAPI.entity)
   * @description Gets the entity name which which DataAPI instance is handling out
   * @return {object} this.#_entity
   */
  get entity () {
    return this.#_entity
  }

  /**
   * @memberof DataAPI.schema
   * @member {getter} DataAPI.schema
   * @example console.log(DataAPI.schema)
   * @description Gets the data schema related to this Entity Data API
   * @return {object} this.#_schema
   */
  get schema () {
    return this.#_schema
  }

  /**
   * @memberof DataAPI
   * @member {getter} DataAPI.strategy
   * @example console.log(DataAPI.strategy)
   * @description Gets the data strategy currently being used
   * @return {string} this.#_strategy
   */
  get strategy () {
    return this.#_strategy
  }

  /**
   * @Method DataAPI.Model
   * @description create a Data Model based on given document
   * @param  {object} doc - A valid document validated against mongoose schema
   * @param  {object} schema - Mongoose based schema
   * @return  {object} model - Mongoose document
  */
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
      const model = new this.Model(doc, this.#_schema)
      const invalid = model.validateSync()
      if (invalid)
      {
        return createMethodSignature(invalid, data)
      }
      rawObj = toJSON(model)
      const __id = await this.#_foundation.localDatabaseTransport
        .table(this.#_entity)
          .add({ ...rawObj })
      data = { __id, ...rawObj }
    } catch (e) {
      error = e
    }
    this.#_foundation.triggerEvent(`collection:add:${this.#_entity.toLowerCase()}`, {
      foundation: this.#_foundation,
      entity: this.#_entity,
      document: rawObj,
      data,
      error,
    })
    const state = { action: 'add', data, error, document: rawObj }
    this.#_sendStateChangeToAllOtherTabs(state)

    return createMethodSignature(error, data)
  }

  /**
   * @async
   * @Method DataAPI.edit
   * @description Edit a document on the storage
   * @param  {string|number} primaryKey - The primary key value of the desired document
   * @param  {object} doc - A valid document validated against mongoose schema
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Edited document
   */
  async edit (primaryKey, doc) {
    let data = null
    let error = null
    let rawObj = {}
    try {
      const model = new this.Model(doc, this.#_schema)
      const invalid = model.validateSync()
      if (invalid) {
        return createMethodSignature(invalid, data)
      }
      rawObj = toJSON(model)
      rawObj.__id = primaryKey
      console.debug('query', {primaryKey, rawObj})
      const response = await this.#_foundation.localDatabaseTransport
        .table(this.#_entity)
        .put({ ...rawObj })
        // .update({ __id: primaryKey }, { ...rawObj })
      console.debug('response', response)
      data = { __id: primaryKey, ...rawObj }
      /* if (response.modifiedCount === 1) {
        data = { __id: primaryKey, ...rawObj }
      } else {
        data = null
        error = {
          message: 'Critical query error on update',
          response
        }
      } */
    } catch (e) {
      console.log(e)
      error = e
    }
    this.#_foundation.triggerEvent(
      `collection:edit:${this.#_entity.toLowerCase()}`,
      {
        foundation: this.#_foundation,
        entity: this.#_entity,
        primaryKey,
        document: rawObj,
        data,
        error
      }
    )
    const state = { action: 'edit', data, error, document: rawObj, primaryKey }
    this.#_sendStateChangeToAllOtherTabs(state)

    return createMethodSignature(error, data)

  }

  /**
   * @async
   * @Method DataAPI.delete
   * @description delete a document from the storage
   * @param  {string|number} primaryKey - The primary key value of the desired document
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Deleted document
   */
  async delete (primaryKey) {
    let data = null
    let error = null
    let rawObj = {}
    try {
      const __id = await this.#_foundation.localDatabaseTransport
        .table(this.#_entity)
         .delete(primaryKey)
      // console.error({ __id })
      data = { __id: primaryKey }
    } catch (e) {
      error = e
    }
    this.#_foundation.triggerEvent(
      `collection:delete:${this.#_entity.toLowerCase()}`,
      {
        foundation: this.#_foundation,
        entity: this.#_entity,
        primaryKey,
        data,
        error
      }
    )
    const state = { action: 'delete', data, error, primaryKey }
    this.#_sendStateChangeToAllOtherTabs(state)

    return createMethodSignature(error, data)
  }

  /**
   * @async
   * @Method DataAPI.findById
   * @description find a document from the storage by ID
   * @param  {string|number} primaryKey - The primary key value of the desired document
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Found document
   */
  async findById (primaryKey) {
    let data = null
    let error = null
    try {
      primaryKey = parseInt(primaryKey)
      const doc = await this.#_foundation.localDatabaseTransport
        .table(this.#_entity)
          .get(primaryKey)
      // console.debug({ __id: primaryKey, doc })
      if (doc)
      {
        if (doc.__id === primaryKey) {
          data = { __id: primaryKey, ...doc }
        }
      }
    } catch (e) {
      console.error('error', error)
      error = e
    }
    return createMethodSignature(error, data)
  }

  /**
   * @async
   * @Method DataAPI.findAll
   * @description find all documents
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {array} signature.data - Array of Found documents
   */
  async findAll(query = {}) {
    let data = null
    let error = null
    try {
      const documents = await this.#_foundation
          .localDatabaseTransport
            .collection(this.#_entity)
              .find(query)
                  .toArray()       
      data = documents
    } catch (e) {
      error = e
    }
    return createMethodSignature(error, data)
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
  async find(query = {}, pagination = this.#_pagination) {
    let { offset, limit } = pagination
    let data = null
    let error = null
    try {
      const documents = await this.#_foundation
          .localDatabaseTransport
            .collection(this.#_entity)
              .find(query)
                .reverse() 
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
      const counter = await this.#_foundation
          .localDatabaseTransport
            .collection(this.#_entity)
              .count(query)     
      data = counter
    } catch (e) {
      error = e
    }
    return createMethodSignature(error, data)
  }


  #_listenToAllOtherTabsStateChanges() {
    window.addEventListener('storage', (event) => {
      if (event.key === this.#_stateChangeStorageName)
      {
        const { key, newValue, oldValue } = event
        if (newValue)
        {
          // console.log('DATAAPI -> got new state change', { key, newValue, oldValue })
          const jsonState = JSON.parse(newValue)
          const { error, data, entity, action, source, document } = jsonState
          // console.error({ error, data, entity, action, source, document })
          const eventObj = {
            foundation: this.#_foundation,
            entity: entity,
            document: document,
            data,
            error
          }
          const eventName = `collection:${action}:${entity.toLowerCase()}`
          // console.log(eventName, eventObj)
          this.#_foundation.triggerEvent(eventName, eventObj)
        }
        // oldValue
      }
    })
  }

  #_sendStateChangeToAllOtherTabs(state = { action: '', data: null, error: null, document: {} }) {
    state.source = this.#_foundation.tabId
    state.entity = this.#_entity
    const stateChange = JSON.stringify(state)
    window.localStorage.setItem(this.#_stateChangeStorageName, stateChange)
    window.localStorage.removeItem(this.#_stateChangeStorageName)
  }
}
