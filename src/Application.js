/* global sessionStorage, navigator */

import { createMethodSignature, GUID } from './utils'
import DataAPI from './DataAPI'
import EventSystem from './EventSystem'


/**
 * Private properties
 */
/**
 * Application name
 * @Private
 * @type  {String}
 */
let _name = 'My Application Name'

/**
 * Models map
 * @Private
 * @type  {Map}
 */
const _models = new Map()

/**
 * Is application started
 * @Private
 * @type  {Boolean}
 */

let _started = false

/**
 * Data strategy
 * recognized values: offlineFirst, onlineFirst, offline, online
 * @Private
 * @type {String}
 */
let _dataStrategy = 'offlineFirst'

let _guid = GUID()
let _useWorker = false
let _serviceWorker = false

const _workerOnMessage = function (event) {
  const {
    cmd /* , message */
  } = event.data
  switch (cmd) {
    case 'responseClientId':
      this.triggerEvent('worker:responseClientId', {
        application: this,
        worker: _serviceWorker,
        ...event.data
      })
      break
    default:
      console.log(`Sorry, we are out of ${cmd}.`)
  }
}

// private API
/**
 * @namespace API
 * @description Private API for Public Application
 * @property {function}  _setModel            - Create an entry on Models Map
 * @property {function}  _mapModels           - Map all models into application namespace and create an associated DataAPI instance
 * @property {function}  _setStarted - Set Application _started flag
 */

const _API = {
  /**
   * @Method _API._setModel
   * @param  {string} entity='' - Data Entity Name for model being set
   * @param  {object} dataAPI={} - DataAPI Instance related to model being set
   */
  _setModel (entity = '', dataAPI = {}) {
    let _error = null
    let _data = null
    try {
      _models.set(entity, dataAPI)
      _data = _models.get(entity)
    } catch (error) {
      _error = error
    }
    return createMethodSignature(_error, _data)
  },
  _mapModels (schemas, application) {
    let _error = null
    let _data = null
    try {
      for (const entity in schemas) {
        if (Object.prototype.hasOwnProperty.call(schemas, entity)) {
          const strategy = 'offlineFirst'
          const model = schemas[entity]
          const dataAPI = new DataAPI({
            application,
            entity,
            strategy,
            model
          })
          this._setModel(entity, dataAPI)
        }
      }
      _data = _models
    } catch (error) {
      _error = error
    }
    return createMethodSignature(_error, _data)
  },
  _setStarted: (started = false) => {
    _started = started
    return createMethodSignature(null, started)
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

    const _myApp = new Application({
      name: 'My App',
      useWorker: true,
      dataStrategy: 'offlineFirst',
      schemas: {
        User: UserSchema
      }
    })

    _myApp.on('application:start', function (eventObj){
      const { application, data, error } = eventObj
 
      if (error) {
        throw new Error(`Error starting application stack: ${error}`)
      }

      const userCollection = application.models.get('User')
      console.log(userCollection)
      await userCollection.add()

    })

    await _myApp.start()
 */
export default class Application extends EventSystem {
  #schemas
  constructor ({
    name,
    dataStrategy = 'offlineFirst',
    useWorker = false,
    schemas = {}
  } = {}) {
    super()
    _name = name
    _dataStrategy = dataStrategy || 'offlineFirst'
    _useWorker = useWorker
    this.#schemas = schemas
  }

  get dataStrategy () {
    return _dataStrategy
  }

  get guid () {
    return _guid
  }

  get models () {
    return _models
  }

  get name () {
    return _name
  }

  set name (name) {
    _name = name
  }

  get started () {
    return _started
  }

  get serviceWorker () {
    return _serviceWorker
  }

  /**
   * @member Application.useWorker
   * @Description flag if is there ServiceWorker being used
   * @return  {boolean}
   */
  get useWorker () {
    return _useWorker
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
      _guid = guidCache
    } else {
      this.setGuidStorage(_guid)
    }
    return this.getGuidStorage()
  }

  registerWorker (workerFile) {
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
              _serviceWorker = reg.installing
              _serviceWorker.postMessage({ cmd: 'getClientId', message: null })
            } else if (reg.active) {
              _serviceWorker = reg.active
              _serviceWorker.postMessage({ cmd: 'getClientId', message: null })
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

  startVitals () {
    let _error = null
    let _data = null
    try {
      this.setupAppGuid()
      const mapModels = _API._mapModels(this.#schemas, this)
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

  async start () {
    let _error = null
    let _data = null
    try {
      const vitals = this.startVitals()

      if (this.useWorker) {
        await this.registerWorker('ServiceWorker.js')
      }

      _API._setStarted(true)

      _data = {
        ...vitals.data,
        started: this.started

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
