/* global sessionStorage, navigator */

import { createMethodSignature, GUID, mongooseToDexieTableString } from './utils'
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
        application: this,
        worker: this.applicationWorker,
        ...event.data
      })
      break
    default:
      console.log(`Sorry, we are out of ${cmd}.`)
  }
}





/**
 * @Class Application
 * @description Application boostrap class
 * @extends EventSystem
 * @param  {object} config - Application configuration
 * @param  {string} config.name - Application name
 * @param  {string} config.dataStrategy - Data strategy. Recognized values: offlineFirst, onlineFirst, offline, online
 * @param  {boolean} config.useWorker - Use a ServiceWorker in Background
 * @param  {object}  config.schemas - map of data schemas
 * @example {@lang javascript}
    import Application from './Application'
    import mongoose from 'mongoose'

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

    const foundation = new Application({
      name: 'My App',
      useWorker: true,
      dataStrategy: 'offlineFirst',
      schemas: {
        User: UserSchema
      }
    })

    foundation.on('application:start', function (eventObj){
      const { application, data, error } = eventObj
 
      if (error) {
        throw new Error(`Error starting application stack: ${error}`)
      }

      const userCollection = application.data.get('User')
      console.log(userCollection)
      await userCollection.add()

    })

    await foundation.start()
 */
export default class Application extends EventSystem {
  
  #_schemas
  #_name
  #_dataStrategy
  #_started
  #_models
  #_guid
  #_useWorker
  #_workers

  constructor ({
    name = 'My Application Name',
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
    console.error(1 , this.#_schemas)
    this.localDatabaseTransport = new LocalDatabaseTransport()
  }

  /**
   * @member {getter} Application.dataStrategy
   * @Description Get the data strategy being used.<br> Possible values are: offlineFirst, onlineFirst, offline, online. <br> Default: offlineFirst
   * @return this.#_dataStrategy
   */
  get dataStrategy () {
    return this.#_dataStrategy
  }

  /**
   * @member {getter} Application.guid
   * @description Get the Application Session guid currently being used.
   * @return this.#_guid
   */
  get guid () {
    return this.#_guid
  }

  /**
   * @member {getter} Application.data
   * @description Get the Application data API(DataAPI)
   * @return this.#_models
   */
  get data() {
    console.debug('get DATA', this.#_models)
    return this.#_models
  }

  /**
   * @member {getter} Application.name
   * @name Application.name
   * @description Get the Application name
   * @example console.log(Application.name)
   * @return this.#_name
   */
  get name () {
    return this.#_name
  }

  /**
   * @member {setter} Application.name
   * @name Application.name
   * @description Set the Application name
   * @example Application.name = 'Provide the name here'
   * @param  {string} name - Application name
   * @return this.#_name
   */
  set name (name) {
    this.#_name = name
    return this.#_name
  }

  /**
   * @member {getter} Application.started
   * @description Get the start state
   * @return this.#_started
   */
  get started () {
    return this.#_started
  }

  /**
   * @member {getter} Application.applicationWorker
   * @description Get the Application worker
   * @return this.#_workers.application
   */
  get applicationWorker() {
    return this.#_workers.application
  }

  #setModel(entity = '', dataAPI = {}) {
    console.error('#setModel', {entity, dataAPI})
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

  #mapModels(schemas) {
    console.error('#mapModels', schemas)
    let _error = null
    let _data = null
    try {
      for (const entity in schemas) {
        if (Object.prototype.hasOwnProperty.call(schemas, entity)) {
          console.debug('for (const entity in schemas)', entity)
          const strategy = 'offlineFirst'
          const schema = schemas[entity]
          const dataAPI = new DataAPI({
            application: this,
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
   * @member {getter} Application.useWorker
   * @Description flag if is there ServiceWorker being used
   * @return  {boolean}
   */
  get useWorker () {
    return this.#_useWorker
  }

  /**
   * @Method Application.setGuidStorage
   * @description save Application GUID to sessionStorage
   * @param  {string} guid
   * @return Application GUID saved on sessionStorage
   */
  setGuidStorage (guid) {
    sessionStorage.setItem('guid', guid)
    return sessionStorage.getItem('guid')
  }

  /**
   * @Method Application.getGuidStorage
   * @description get Application GUID saved on sessionStorage
   * @return Application GUID saved on sessionStorage
   */
  getGuidStorage () {
    return sessionStorage.getItem('guid') || false
  }

  /**
   * @Method Application.setupAppGuid
   * @description check if Application has a GUID saved o
   * @return Application GUID saved on sessionStorage
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
   * @Method Application.#registerApplicationWorker
   * @description Setup and Register a Service worker and get it ready for usage
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
              self.#_workers['application'] = reg.installing
              self.#_workers['application'].postMessage({ cmd: 'getClientId', message: null })
            } else if (reg.active) {
              self.#_workers['application'] = reg.active
              self.#_workers['application'].postMessage({ cmd: 'getClientId', message: null })
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
   * @Method Application.#registerApplicationWorker
   * @description Setup and Register a Service worker and get it ready for usage
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
   * @description Starts application stack required items
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Application data
   */
  async #startVitals () {
    let _error = null
    let _data = null
    try {
      this.setupAppGuid()
      const mapModels = this.#mapModels(this.#_schemas)
      console.error('#startVitals this.#_schemas', this.#_schemas)
      console.error('#startVitals this.data', this.data)

      
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

    this.triggerEvent('application:startVitals', {
      application: this,
      error: _error,
      data: _data
    })

    return createMethodSignature(_error, _data)
  }
  /**
   * @async
   * @Method Application.start
   * @description Starts application stack and get it ready to use. <br> it calls this.#startVitals() internally 
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Application data
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

    this.triggerEvent('application:start', {
      application: this,
      error: _error,
      data: _data
    })

    return createMethodSignature(_error, _data)
  }
}
