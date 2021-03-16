/* global localStorage, navigator, window */
import { createMethodSignature, uuid, Schema, genDbName } from './utils'
import DataEntity from './DataEntity'
import LocalDatabaseTransport from './LocalDatabaseTransport'
import EventSystem from './EventSystem'
import DataJobManager from './DataJobManager'


// import workerOnMessage from './events/workerOnMessage'

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
// =========> main.js
// import React
import React from 'react'
import ReactDOM from 'react-dom'

// import Bootstrap
import 'bootstrap/dist/css/bootstrap.css'

// import React app
import App from './App'

// import agnostic foundation foundation class
import Foundation from './foundation/Foundation'

const CustomerSchema = new Foundation.Schema({
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

const OrderSchema = new Foundation.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    shipTo: {
        type: String,
        required: true,
        index: true
    },
    paymentMethod: {
        type: String,
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
        index: true
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    }
})

const ProductSchema = new Foundation.Schema({
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

const UserSchema = new Foundation.Schema({
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
    dataStrategy: 'offline',
    schemas: {
        User: UserSchema,
        Product: ProductSchema,
        Order: OrderSchema,
        Customer: CustomerSchema
    }
})

foundation.on('foundation:start', async function(eventObj) {
    const {
        foundation,
        error
    } = eventObj
    if (error) {
        throw new Error(`Error starting foundation stack: ${error}`)
    }
    const {
        User,
        Product
    } = foundation.data
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

const start = await foundation.start()
if (start.error) {
    throw new Error(`Error starting foundation stack: ${start.error}`)
}
// console.debug('start', start)
ReactDOM.render(
  <App foundation={foundation} />,
  document.getElementById('root')
)
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
  #_jobMamanager

  constructor ({
    name = 'My Foundation Name',
    dataStrategy = 'offline',
    useWorker = false,
    schemas
  }) {
    super()
    this.#_name = name
    this.#_dataStrategy = dataStrategy
    this.#_useWorker = useWorker
    this.#_schemas = schemas
    this.#_started = false
    this.#_guid = uuid()
    this.#_models = {}
    this.#_useWorker = useWorker || false
    this.#_workers = {}
    
    this.#_jobMamanager = new DataJobManager()

    this.localDatabaseTransport = new LocalDatabaseTransport({
      dbName: genDbName(name)
    })
    this.#_tabId = uuid() // assume new Id on every refresh
  }

  get jobManager() {
    return this.#_jobMamanager
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
   * @description Get the Foundation data API(DataEntity)
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

  /**
   * @Method Foundation.mapToDataEntityAPI
   * @summary Maps an Data Entity abstraction to foundation Data API
   * @description An Data Entity abstraction is an instance of the {@link DataEntity}. 
   * Once it is mapped to foundation Data API, you can reach every Data Entity in the system from a single source point.
   * This method dont works as expected if  you call it after {@link Foundation.start} method.
   * See {@link Foundation.importDataEntity} for usage further information.
   * @param  {string} entity - Data Entity name
   * @param  {dataEntity} dataEntity - An {@link DataEntity} instance
   */
  mapToDataEntityAPI(entity, dataEntity) {
    let _error = null
    let _data = null
    // if call mapToDataEntityAPI('Product') more than once, it will ovewrite the previous set Product model
    this.#_models[entity] = dataEntity
    _data = this.#_models[entity]
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

  /**
   * @Method Foundation.importDataEntity
   * @summary Alias to Foundation.mapToDataEntityAPI(entity = '', dataEntity = {})
   * @description An Data Entity abstraction is an instance of the {@link DataEntity}. 
   * Once it is mapped to foundation Data API, you can reach every Data Entity in the system from a single source point.
   * This method dont works as expected if  you call it after {@link Foundation.start} method
   * @param  {object} spec - Data Entity abstraction specification
   * @param  {string} spec.entity - Data Entity name
   * @param  {dataEntity} spec.dataEntity - An {@link DataEntity} instance for the entity defined on `spec.entity`
   * @example
const productSchema = new Foundation.Schema({
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
  price: {
    type: Number,
    required: true,
    index: true
  }
})

// start the foundation
const foundation = new Foundation({
  name: 'My Test app',
  schemas: {
    // Customer: schema
  }
})

// Build a customized Data Entity abstraction
const MyCustomizedDataEntity = class extends DataEntity {
  constructor (config) {
    super(config)
  }

  sell (primaryKey, orderId) {
    // primaryKey is Product primary key value
    // orderId is the primaryKey of an Order
    // const foundOrder = await Order.findById(orderId)
    // if (foundOrder.error) {
    //  CAN NOT TO SELL
    // }
    // const items = foundOrder.data.lineItems.filter(i => (i.productId === primaryKey))
    // If  Order has the product listed item
    // if(items[0])
    // {
    //    await this.delete(primaryKey) // deletes a Product from Products
    // }
  }
}

// instance of the custimized Data Entity
const productDataEntity = new MyCustomizedDataEntity({
  foundation,
  entity: 'Product',
  schema: productSchema
})

// import data entity
foundation.importDataEntity({
  entity: 'Product',
  dataEntity: productDataEntity
})

// start the foundation
await foundation.start()

// you can now do things like:

const { Product } = foundation.data

await Product.add({
  name: 'Big Mac',
  vendor: 'McDonalds',
  price: 3
})

   */
  importDataEntity({ entity, dataEntity}) {
    this.mapToDataEntityAPI(entity, dataEntity)
  }

  #mapModels(schemas) {
    let _error = null
    let _data = null
    for (const entity in schemas) {
      if (Object.prototype.hasOwnProperty.call(schemas, entity)) {
        // console.debug('for (const entity in schemas)', entity)
        const strategy = 'offlineFirst'
        const schema = schemas[entity]
        const dataEntity = new DataEntity({
          foundation: this,
          entity,
          strategy,
          schema
        })
        this.mapToDataEntityAPI(entity, dataEntity)
      }
    }
    // _data = this.#_models
    // return createMethodSignature(_error, _data)
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
   * @description save Foundation uuid to localStorage
   * @param  {string} guid
   * @return Foundation uuid saved on localStorage
   */
  setGuidStorage (guid) {
    window.localStorage.setItem('guid', guid)
    return window.localStorage.getItem('guid')
  }

  /**
   * @Method Foundation.setupAppGuid
   * @description check if Foundation has a uuid saved o
   * @return Foundation uuid saved on localStorage
   */
  setupAppGuid () {
    const guidCache = window.localStorage.getItem('guid') || false
    if (guidCache) {
      this.#_guid = guidCache
    } else {
      this.setGuidStorage(this.#_guid)
    }
    return window.localStorage.getItem('guid')
  }

  startVooduXWebWorker() {
    console.log(window.location)
    if (window.location.href.indexOf('cypress') > -1) {
      return
    }
  }
  
  /**
   * @async
   * @Method Foundation.#registerApplicationWorker
   * @description Setup and Register the main Service worker used by foundation core
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Worker Registration Object
   */
  /* #registerApplicationWorker (workerFile = 'ServiceWorker.js') {
    const self = this
    return new Promise((resolve, reject) => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/' + workerFile, {
            // scope: '/'
          })
          .then(function (reg) {
            // registration worked
            navigator.serviceWorker.addEventListener('message', workerOnMessage.bind(self))
            if (reg.installing) {
              self.#_workers['foundation'] = reg.installing
              self.#_workers['foundation'].postMessage({ action: 'getClientId', message: null })
            } else if (reg.active) {
              self.#_workers['foundation'] = reg.active
              self.#_workers['foundation'].postMessage({ action: 'getClientId', message: null })
            }
            resolve(createMethodSignature(null, reg))
          })
          .catch(function (error) {
            // registration failed
            resolve(createMethodSignature(error, null))
          })
      }
    })
  } */

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
  /* #registerWorker (name = '', workerFile = 'ServiceWorker.js') {
    const self = this
    return new Promise((resolve, reject) => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/' + workerFile, {
            // scope: '/'
          })
          .then(function (reg) {
            // registration worked
            navigator.serviceWorker.addEventListener('message', workerOnMessage.bind(self))
            if (reg.installing) {
              self.#_workers[name] = reg.installing
              self.#_workers[name].postMessage({ action: 'getClientId', message: null })
            } else if (reg.active) {
              self.#_workers[name] = reg.active
              self.#_workers[name].postMessage({ action: 'getClientId', message: null })
            }
            resolve(createMethodSignature(null, reg))
          })
          .catch(function (error) {
            // registration failed
            resolve(createMethodSignature(error, null))
          })
      }
    })
  } */

  
  /**
   * @async
   * @Method Foundation.start
   * @description Starts foundation stack and get it ready to use. <br> it calls this.#startVitals() internally 
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error
   * @return  {object} signature.data - Foundation data
   */
  async start() {
    return new Promise(async(resolve, reject) => {
      let _error = null
      let _data = null
      try {
        this.setupAppGuid()
        const mapModels = this.#mapModels(this.#_schemas)
        const connection = await this.localDatabaseTransport.connect()
        console.warn('tables tables', this.localDatabaseTransport.tables)
        this.jobManager.mapSchemas(this.#_schemas)
        this.jobManager.start()
        
        

        this.startVooduXWebWorker()

        if (connection.error) {
          _error = connection.error
        } else {
          this.#_started = true
          _data = {
            status: {
              mapModels,
              connection
            },
            started: this.#_started
          }
        }
      } catch (error) {
        console.error('error')
        _error = error
        _data = null
      }

      

      // todo 
      // console.warn('STARTED>>>>>>>>>>>', this)
      setTimeout(() => {
        this.triggerEvent('foundation:start', {
          foundation: this,
          error: _error,
          data: _data
        })
        resolve(createMethodSignature(_error, _data))
      }, 1000)
    })
  }
}
