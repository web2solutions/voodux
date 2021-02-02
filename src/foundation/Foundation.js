/* global localStorage, navigator, window */
import { createMethodSignature, GUID, Schema } from './utils'
import DataAPI from './DataAPI'
import LocalDatabaseTransport from './LocalDatabaseTransport'
import EventSystem from './EventSystem'



const _workerOnMessage = function (event) {
  // console.error('_workerOnMessage')
  const {
    cmd /* , message */
  } = event.data
  switch (cmd) {
    case 'responseClientId':
      this.triggerEvent('worker:responseClientId', {
        foundation: this,
        worker: this.applicationWorker,
        ...event.data
      })
      break
    default:
      console.log(`Sorry, we are out of ${cmd}.`)
  }
}





/**
 * @author Eduardo Perotta de Almeida <web2solucoes@gmail.com>
 * @Class Foundation
 * @description Foundation boostrap class
 * @extends EventSystem
 * @param  {object} config - Foundation configuration
 * @param  {string} config.name - Foundation name
 * @param  {string} config.dataStrategy - Data strategy. Recognized values: offlineFirst, onlineFirst, offline, online
 * @param  {boolean} config.useWorker - Use a ServiceWorker in Background
 * @param  {object}  config.schemas - map of data schemas
 * @example {@lang javascript}
    import Foundation from './Foundation'
    import mongoose from 'mongoose'

    const ProductSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        index: true
      },
      vendor: {
        type: String,
        required: true,
        index: true
      },
      price_cost: {
        type: Number,
        required: true,
        default: 0,
        index: true
      }
    })

    const UserSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true
      }
    })

    const foundation = new Foundation({
      name: 'My App',
      useWorker: true,
      dataStrategy: 'offlineFirst',
      schemas: {
        User: UserSchema,
        Product: ProductSchema
      }
    })

    foundation.on('foundation:start', function (eventObj){
      const { foundation, error } = eventObj
      if (error) {
        throw new Error(`Error starting foundation stack: ${error}`)
      }
      const { User, Product } = foundation.data
      const Eduardo = await User.add({
        name: 'Eduardo Almeida',
        username: 'web2'
      })
      console.debug('Eduardo', Eduardo)

      const Volvo = await Product.add({
        name: 'Volvo XC90',
        vendor: 'Volvo',
        price_cost: 150000
      })
      console.debug('Volvo', Volvo)
    })
    
    // start foundation and get it ready to be used
    await foundation.start()
 */
export default class Foundation extends EventSystem {
  
  #_schemas
  #_name
  #_dataStrategy
  #_started
  #_models
  #_guid
  #_useWorker
  #_workers
  #_tabId

  constructor ({
    name = 'My Foundation Name',
    dataStrategy = 'offlineFirst',
    useWorker = false,
    schemas = {}
  } = {}) {
    super()
    this.#_name = name
    this.#_dataStrategy = dataStrategy
    this.#_useWorker = useWorker
    this.#_schemas = schemas
    this.#_started = false
    this.#_guid = GUID()
    this.#_models = {}
    this.#_useWorker = useWorker || false
    this.#_workers = {}
    this.localDatabaseTransport = new LocalDatabaseTransport()
    this.#_tabId = GUID() // assume new Id on every refresh
  }

  /**
   * @member {getter} Foundation.dataStrategy
   * @Description Get the data strategy being used.<br> Possible values are: offlineFirst, onlineFirst, offline, online. <br> Default: offlineFirst
   * @example console.log(Foundation.dataStrategy)
   * @return {string} this.#_dataStrategy
   */
  get dataStrategy () {
    return this.#_dataStrategy
  }

  /**
   * @member {getter} Foundation.guid
   * @description Get the Foundation Session guid currently being used.
   * @example console.log(Foundation.guid)
   */
  get guid () {
    return this.#_guid
  }

  /**
   * @member {getter} Foundation.data
   * @description Get the Foundation data API(DataAPI)
   * @example 
      const { User, Product } = foundation.data
      const Eduardo = await User.add({
        name: 'Eduardo Almeida',
        username: 'web2'
      })
      console.debug(Eduardo)
      // {  
      //    data: {__id: 1, _id: "600e0ae8d9d7f50000e1444b", name: "Eduardo Almeida", username: "web2", id: "600e0ae8d9d7f50000e1444b"}
      //    error: null
      // }
   */
  get data() {
    return this.#_models
  }

  /**
   * @member {getter} Foundation.tabId
   * @description Get the Browser tab ID
   * @example 
      console.log(foundation.tabId)
   */
  get tabId() {
    return this.#_tabId
  }

  /**
   * @member {getter} Foundation.name
   * @name Foundation.name
   * @description Get the Foundation name
   * @example console.log(Foundation.name)
   */
  get name () {
    return this.#_name
  }

  /**
   * @member {setter} Foundation.name
   * @name Foundation.name
   * @description Set the Foundation name
   * @example Foundation.name = 'Provide the name here'
   * @param  {string} name - Foundation name
   */
  set name (name) {
    this.#_name = name
  }

  /**
   * @member {getter} Foundation.started
   * @description Get the start state
   * @example console.log(Foundation.started)
   */
  get started () {
    return this.#_started
  }

  /**
   * @memberof Foundation
   * @member {getter} Foundation.applicationWorker
   * @example Foundation.applicationWorker.postMessage()
   * @description Get the Foundation worker
   */
  get applicationWorker() {
    return this.#_workers.foundation
  }

  #setModel(entity = '', dataAPI = {}) {
    let _error = null
    let _data = null
    try {
      this.#_models[entity] =  dataAPI
      _data = this.#_models[entity]
    } catch (error) {
      console.error('EROROR', error)
      _error = error
    }
    return createMethodSignature(_error, _data)
  }
  
  /**
   * @memberof Foundation
   * @member {getter} Foundation.Schema
   * @example new Foundation.Schema({})
   * @description Creates new data schema
   * @returns schema creator
   */
  static get Schema() {
    return Schema
  }

  #mapModels(schemas) {
    let _error = null
    let _data = null
    try {
      for (const entity in schemas) {
        if (Object.prototype.hasOwnProperty.call(schemas, entity)) {
          // console.debug('for (const entity in schemas)', entity)
          const strategy = 'offlineFirst'
          const schema = schemas[entity]
          const dataAPI = new DataAPI({
            foundation: this,
            entity,
            strategy,
            schema
          })
          this.#setModel(entity, dataAPI)
        }
      }
      _data = this.#_models
    } catch (error) {
      console.error(error)
      _error = error
    }
    return createMethodSignature(_error, _data)
  }

  /**
   * @member {getter} Foundation.useWorker
   * @Description flag if is there ServiceWorker being used
   * @return  {boolean}
   */
  get useWorker () {
    return this.#_useWorker
  }

  /**
   * @Method Foundation.setGuidStorage
   * @description save Foundation GUID to localStorage
   * @param  {string} guid
   * @return Foundation GUID saved on localStorage
   */
  setGuidStorage (guid) {
    localStorage.setItem('guid', guid)
    return localStorage.getItem('guid')
  }

  /**
   * @Method Foundation.getGuidStorage
   * @description get Foundation GUID saved on localStorage
   * @example foundation.getGuidStorage()
   * @return Foundation GUID saved on localStorage
   */
  getGuidStorage () {
    return localStorage.getItem('guid') || false
  }

  /**
   * @Method Foundation.setupAppGuid
   * @description check if Foundation has a GUID saved o
   * @return Foundation GUID saved on localStorage
   */
  setupAppGuid () {
    const guidCache = this.getGuidStorage() || false
    if (guidCache) {
      this.#_guid = guidCache
    } else {
      this.setGuidStorage(this.#_guid)
    }
    return this.getGuidStorage()
  }
  
  /**
   * @async
   * @Method Foundation.#registerApplicationWorker
   * @description Setup and Register the main Service worker used by foundation core
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Worker Registration Object
   */
  #registerApplicationWorker (workerFile = 'ServiceWorker.js') {
    const self = this
    return new Promise((resolve, reject) => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/' + workerFile, {
            // scope: '/'
          })
          .then(function (reg) {
            // registration worked
            navigator.serviceWorker.addEventListener('message', _workerOnMessage.bind(self))
            if (reg.installing) {
              self.#_workers['foundation'] = reg.installing
              self.#_workers['foundation'].postMessage({ cmd: 'getClientId', message: null })
            } else if (reg.active) {
              self.#_workers['foundation'] = reg.active
              self.#_workers['foundation'].postMessage({ cmd: 'getClientId', message: null })
            }
            resolve(createMethodSignature(null, reg))
          })
          .catch(function (error) {
            // registration failed
            resolve(createMethodSignature(error, null))
          })
      }
    })
  }

  /**
   * @async
   * @Method Foundation.#registerWorker
   * @description Setup and Register a Service worker and get it ready for usage into your application scope
   * @param  {string} name - Worker name. Used to access it from the namespace
   * @param  {string} workerFile - Worker file name
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Worker Registration Object
   */
  #registerWorker (name = '', workerFile = 'ServiceWorker.js') {
    const self = this
    return new Promise((resolve, reject) => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/' + workerFile, {
            // scope: '/'
          })
          .then(function (reg) {
            // registration worked
            navigator.serviceWorker.addEventListener('message', _workerOnMessage.bind(self))
            if (reg.installing) {
              self.#_workers[name] = reg.installing
              self.#_workers[name].postMessage({ cmd: 'getClientId', message: null })
            } else if (reg.active) {
              self.#_workers[name] = reg.active
              self.#_workers[name].postMessage({ cmd: 'getClientId', message: null })
            }
            resolve(createMethodSignature(null, reg))
          })
          .catch(function (error) {
            // registration failed
            resolve(createMethodSignature(error, null))
          })
      }
    })
  }

  /**
   * @Private
   * @description Starts foundation stack required items
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Foundation data
   */
  async #startVitals () {
    let _error = null
    let _data = null
    try {
      this.setupAppGuid()
      const mapModels = this.#mapModels(this.#_schemas)
      
      await this.localDatabaseTransport.connect()
      // start database
      // start all here
      _data = {
        status: {
          mapModels
        }
      }
    } catch (error) {
      console.error(error)
      _error = error
    }

    this.triggerEvent('foundation:startVitals', {
      foundation: this,
      error: _error,
      data: _data
    })

    return createMethodSignature(_error, _data)
  }
  /**
   * @async
   * @Method Foundation.start
   * @description Starts foundation stack and get it ready to use. <br> it calls this.#startVitals() internally 
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Foundation data
   */
  async start () {
    let _error = null
    let _data = null
    try {
      const vitals = await this.#startVitals()

      if (this.useWorker) {
        await this.#registerApplicationWorker()
      }

      this.#_started = true
      

      _data = {
        ...vitals.data,
        started: this.#_started

      }
    } catch (error) {
      console.error(error)
      _error = error
    }

    this.triggerEvent('foundation:start', {
      foundation: this,
      error: _error,
      data: _data
    })
    // console.warn('STARTED>>>>>>>>>>>', this)
    return createMethodSignature(_error, _data)
  }
}
