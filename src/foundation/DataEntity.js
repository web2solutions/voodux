/* global localStorage, navigator, window */
import EventSystem from './EventSystem'
// import Dexie from 'dexie'
import mongoose from 'mongoose'
import { createMethodSignature, GUID, toJSON } from './utils'

/**
 * @author Eduardo Perotta de Almeida <web2solucoes@gmail.com>
 * @Class DataEntity
 * @summary Data Entity API
 * @description When composing web applications using this library, we strongly believe the data design and plan should be the entry point of your software design.
 * <br><br>The Entity Relationship diagram shall to be one of the initial documents you should to design before starting to write your software.
 * <br><br>We assume the {@link https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model|Entity Relationship} and {@link https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model|Data Entity} models as technique and paradigm to design the application data. 
 * <br><br>If you have no idea of how agile you could to design your ER diagram, please take a look at some tools like {@Link https://www.datensen.com/data-modeling/moon-modeler-for-databases.html|Moon Modeler}
 * <br><br> Every Data Entity in the system has it own encapsulated properties and methods that cares about where entity data is writen to and read from. 
 * <br><br> The DataEntity relies on the application instance (passed to it constructor) to access the available data transports. 
 * <br>It means you can not use DataEntity prior starting a data transport layer. 
 * <br><br> This class is not for direct usage in your project, unless you are a core developer or want to understand what happens behind the scenes, you should consider to take a look at the {@link Foundation} class.
 * @extends EventSystem
 * @param  {object} DataEntityConfig - Data Entity configuration
 * @param  {string} DataEntityConfig.foundation - Provide Accesss to Foundation scope
 * @param  {string} DataEntityConfig.entity - Data entity name which this dataEntity instance is handling
 * @param  {boolean} DataEntityConfig.strategy - Data transport strategy
 * @param  {boolean} DataEntityConfig.schema - Data schema for this Data Entity abstraction. <br> Do not declare the params __id and _id inside your schemas.
 * @example
import { Schema } from '../foundation/Foundation'

const schema = new Schema({
  // do not declare __id
  // do not declare _id
  name: {
    type: String,
    required: true,
    index: true
  },
  address: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  cards: {
    type: [],
    required: true
  }
})

const Customer = new DataEntity({
  foundation, // Foundation instance, object
  entity: 'Customer', // entity name, string
  strategy: 'offline', // data strategy, string
  schema // data schema, a mongoose like schema
})

// listen to add Customer Data event on Data API
const onAddDocEventListener = Customer.on(
  'add',
  function(eventObj){
    const { error, document, foundation, data } = eventObj
    // do something like to update the component View state Based On Information from Incoming Event
    component.setState({ propertyName: newValue }) // React: 
    component.$set(component.data, 'propertyName', newValue) // Vue:

  }
)
// listen to edit Customer Data event on Data API
const onEditDocEventListener = Customer.on(
  'edit',
  function (eventObj) {
    const { error, document, foundation, data } = eventObj
    // do something like to update the component View state Based On Information from Incoming Event
    component.setState({ propertyName: newValue }) // React: 
    component.$set(component.data, 'propertyName', newValue) // Vue:
  }
)
// listen to delete Customer Data event on Data API
const onDeleteDocEventListener = Customer.on(
  'delete',
  function (eventObj) {
    const { error, document, foundation, data } = eventObj
    // do something like to update the component View state Based On Information from Incoming Event
    component.setState({ propertyName: newValue }) // React: 
    component.$set(component.data, 'propertyName', newValue) // Vue:
  }
)

// Stop to listen to events to avoid memory leak or others kind of problems
// like to change the state of an unmounted component.
// Do something like this -> before component unmount OR before window unload
Customer.stopListenTo(onAddDocEventListener)
Customer.stopListenTo(onEditDocEventListener)
Customer.stopListenTo(onDeleteDocEventListener)

 */

export default class DataEntity extends EventSystem {

  #_foundation
  #_entity
  #_strategy
  #_schema
  #_pagination
  #_stateChangeStorageName

  constructor ({ foundation, entity, strategy, schema } = {}) {
    super()
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
    
    this.#_listenToAllOtherSessionsStateChanges()
  }

  /**
   * @memberof DataEntity.entity
   * @member {getter} DataEntity.entity
   * @example console.log(DataEntity.entity)
   * @description Gets the entity name which which DataEntity instance is handling out
   * @return {object} this.#_entity
   */
  get entity () {
    return this.#_entity
  }

  /**
   * @memberof DataEntity.schema
   * @member {getter} DataEntity.schema
   * @example console.log(DataEntity.schema)
   * @description Gets the data schema related to this Entity Data API
   * @return {object} this.#_schema
   */
  get schema () {
    return this.#_schema
  }

  /**
   * @memberof DataEntity
   * @member {getter} DataEntity.strategy
   * @example console.log(DataEntity.strategy)
   * @description Gets the data strategy currently being used
   * @return {string} this.#_strategy
   */
  get strategy () {
    return this.#_strategy
  }

  /**
   * @Method DataEntity.Model
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
   * @Method DataEntity.add
   * @description add a new document to the storage
   * @param  {object} doc - A valid document validated against mongoose schema
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Created document
   * @example 
const doc = { 
  name: 'Eduardo Almeida',
  address: 'Av. Beira Mar. Praia do Morro, Guarapari - ES. Brazil.',
  email: 'web2solucoes@gmail.com',
  cards: []
}
const { data, error } = await Customer.add(doc)
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
    
    this.#_triggerAddEvents({ data, error, primaryKey: data.__id, rawObj })
    return createMethodSignature(error, data)
  }

  /**
   * @Method DataEntity.#_triggerAddEvents
   * @description PRIVATE - Triggers all events related to 'add document' event
   * @param  {object} eventPayload - Object containing all information about the event
   * @param  {object} eventPayload.data - The new document inserted into database, default is null if not provided
   * @param  {object|string} eventPayload.error - The returned error from database add request if any, default is null if not provided
   * @param  {number} eventPayload.primaryKey - The primaryKey value of the added document, default is zero if not provided
   * @param  {object} eventPayload.rawObj - The raw document object provided on dataEntity.add(doc) mehod call. Default is {} if not provided.
  */
  #_triggerAddEvents({ data = null, error = null, primaryKey = 0, rawObj = {} } = {}) {
    const action = 'add'
    this.#_foundation.triggerEvent(`collection:${action}:${this.#_entity.toLowerCase()}`, {
      foundation: this.#_foundation,
      entity: this.#_entity,
      document: rawObj,
      primaryKey,
      data,
      error,
    })
    this.triggerEvent(action, {
      foundation: this.#_foundation,
      entity: this.#_entity,
      document: rawObj,
      primaryKey,
      data,
      error,
    })
    const state = { action, data, error, document: rawObj, primaryKey }
    this.#_sendStateChangeToAllOtherSessions(state)
  }

  /**
   * @async
   * @Method DataEntity.edit
   * @description Edit a document on the storage
   * @param  {string|number} primaryKey - The primary key value of the desired document
   * @param  {object} doc - A valid document validated against mongoose schema
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Edited document
   * @example 
const doc = {
  __id: 1,
  _id: '601cb8d8623dc60000ee3c24',
  name: 'Eduardo Almeida',
  address: 'Av. Beira Mar. Praia do Morro, Guarapari - ES. Brazil.',
  email: 'web2solucoes@gmail.com',
  cards: []
}
const { data, error } = await Customer.edit(doc.__id, doc)
   */
  async edit(primaryKey, doc) {
    primaryKey = +primaryKey
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
    this.#_triggerEditEvents({ data, error, primaryKey, rawObj })
    return createMethodSignature(error, data)
  }

  /**
   * @Method DataEntity.#_triggerEditEvents
   * @description PRIVATE - Triggers all events related to 'edit document' event
   * @param  {object} eventPayload - Object containing all information about the event
   * @param  {object} eventPayload.data - The new document updated into database, default is null if not provided
   * @param  {object|string} eventPayload.error - The returned error from database edit request if any, default is null if not provided
   * @param  {number} eventPayload.primaryKey - The primaryKey value of the edited document, default is zero if not provided
   * @param  {object} eventPayload.rawObj - The raw document object provided on dataEntity.edit(primaryKey, doc) mehod call. Default is {} if not provided.
  */
  #_triggerEditEvents({ data = null, error = null, primaryKey = 0, rawObj = {} } = {}) {
    const action = 'edit'
    this.#_foundation.triggerEvent(
      `collection:${action}:${this.#_entity.toLowerCase()}`,
      {
        foundation: this.#_foundation,
        entity: this.#_entity,
        primaryKey,
        document: rawObj,
        data,
        error
      }
    )
    this.triggerEvent(
      action,
      {
        foundation: this.#_foundation,
        entity: this.#_entity,
        primaryKey,
        document: rawObj,
        data,
        error
      }
    )
    const state = { action, data, error, document: rawObj, primaryKey }
    this.#_sendStateChangeToAllOtherSessions(state)
  }

  /**
   * @async
   * @Method DataEntity.delete
   * @description delete a document from the storage
   * @param  {string|number} primaryKey - The primary key value of the desired document
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Deleted document
   */
  async delete(primaryKey) {
    primaryKey = +primaryKey
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
    this.#_triggerDeleteEvents({ data, error, primaryKey })
    return createMethodSignature(error, data)
  }

  /**
   * @Method DataEntity.#_triggerDeleteEvents
   * @description PRIVATE - Triggers all events related to 'delete document' event
   * @param  {object} eventPayload - Object containing all information about the event
   * @param  {object} eventPayload.data - A object containing the __id property of the deleted document, default is null if not provided
   * @param  {object|string} eventPayload.error - The returned error from database edit request if any, default is null if not provided
   * @param  {number} eventPayload.primaryKey - The primaryKey value of the deleted document, default is zero if not provided
  */
  #_triggerDeleteEvents({ data = null, error = null, primaryKey = 0 } = {}) {
    const action = 'delete'
    this.#_foundation.triggerEvent(
      `collection:${action}:${this.#_entity.toLowerCase()}`,
      {
        foundation: this.#_foundation,
        entity: this.#_entity,
        primaryKey,
        data,
        error
      }
    )
    this.triggerEvent(
      action,
      {
        foundation: this.#_foundation,
        entity: this.#_entity,
        primaryKey,
        data,
        error
      }
    )
    const state = { action, data, error, primaryKey }
    this.#_sendStateChangeToAllOtherSessions(state)
  }

  /**
   * @async
   * @Method DataEntity.findById
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
   * @Method DataEntity.findAll
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
   * @Method DataEntity.find
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
   * @Method DataEntity.count
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

  /**
   * @Method DataEntity.#_listenToAllOtherSessionsStateChanges
   * @summary PRIVATE - Listen to data state changes on every Application session.
   * @description Listen to data state change event incoming from every other Application session and communicates to every subscriber tied to this session.
   * <br><br>  The application scope is the browser running the application. 
   * <br><br>  Every tab is considered a session. 
   * <br> <br> Internally it triggers all events related to data change events, except if the source, the session which originated the event, is the same that is receiving the event
   * <br> <br> It does not rely on network to propagate the changes.
   * @example 
        this.#_listenToAllOtherSessionsStateChanges()
  */
  #_listenToAllOtherSessionsStateChanges() {
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
          this.#_foundation.triggerEvent(eventName, eventObj)
          this.triggerEvent(action, eventObj)
        }
        // oldValue
      }
    })
  }

  /**
   * @Method DataEntity.#_sendStateChangeToAllOtherSessions
   * @summary PRIVATE - Sends data state changes information to every other current application session.
   * @description The application scope is the browser running the application. <br> Every tab is considered a session.<br> It can not rely on network.
   * @param  {object} state - Object containing all information about the state
   * @param  {object} state.data - The modified data, default is null if not provided
   * @param  {object|string} state.error - The returned error when trying to modify the data, default is null if not provided
   * @param  {object} state.document - The raw object used as value to get the new data state, default is {} if not provided
   * @example 
        this.#_sendStateChangeToAllOtherSessions({ 
          action: 'add', 
          data: {...newDocument}, 
          error: null, 
          document: {...originalDocument} 
        })
  */
  #_sendStateChangeToAllOtherSessions(state = { action: '', data: null, error: null, document: {} }) {
    state.source = {
      sessionId: this.#_foundation.tabId,
      applicationId: this.#_foundation.guid,
    }
    state.entity = this.#_entity
    const stateChange = JSON.stringify(state)
    window.localStorage.setItem(this.#_stateChangeStorageName, stateChange)
    window.localStorage.removeItem(this.#_stateChangeStorageName)
  }
}
