/* global describe it Blob before */

// import agnostic foundation foundation class
// const {
  // Foundation,
  // LocalDatabaseTransport,
  // DataEntity,
  // utils
// } = require('../../dist/main').default

import {
  Foundation,
  LocalDatabaseTransport,
  DataEntity,
  utils
} from '../../dist/main.js'


import assert from 'assert'

const Schema = Foundation.Schema

let foundation = null
let Customer = null
let Product = null

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
    //    await super.delete(primaryKey) // deletes a Product from Products
    // }
  }
}

// define schemas
const schema = new Schema({
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

const productSchema = new Schema({
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


describe('#--- DataEntity Class Test Suite', () => {
  before(function (done) {
    ;(async function () {
      try {
        // create the foundation
        foundation = new Foundation({
          name: 'My Test app',
          schemas: {
            // Customer: schema
          }
        })

        // Use Customer DataEntity from outside Application DataEntity API
        Customer = new DataEntity({
          foundation, // Foundation instance, object
          entity: 'Customer', // entity name, string
          schema // data schema, a mongoose like schema
        })
        
        done()
      } catch (error) {
        // console.log('>>>>>>>>>', error)
        done(error)
      }
    })()
  })

  describe('Check class integrity', () => {
    it('DataEntity must have a constructor', (done) => {
      assert.equal(DataEntity.constructor, Function)
      done()
    })
    it('Using Product DataEntity API imported from foundation DataEntity API must works', (done) => {
      ;(async () => {

        // import customized Product Data Entity to Application Data Entity API
        foundation.importDataEntity({
          entity: 'Product',
          dataEntity: new MyCustomizedDataEntity({
            foundation,
            entity: 'Product',
            schema: productSchema
          })
        })
        
        // start the application foundation
        await foundation.start()

        // Get Product Data entity from Application Data Entity API
        Product = foundation.data.Product

        assert.equal(Product !== null, true)
        // assert.equal(Product instanceof DataEntity, true)
        done()
      })()
    })
    
    
    it('Customer must be instance of DataEntity', (done) => {
      assert.equal(Customer instanceof DataEntity, true)
      done()
    })

    it('Customer.entity must be equal to "Customer"', (done) => {
      assert.equal(Customer.entity === 'Customer', true)
      done()
    })

    // check all getters only
    it('Customer.entity is getter only', (done) => {
      let error = null
      try {
        Customer.entity = 222222
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      assert.notEqual(Customer.entity, 222222)
      done()
    })

    it('Customer.strategy is getter only', (done) => {
      let error = null
      try {
        Customer.entity = 222222
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      assert.notEqual(Customer.strategy, 222222)
      done()
    })

    it('Customer.strategy must be "offlineFirst"', (done) => {
      let error = null
      assert.equal(Customer.strategy, 'offlineFirst')
      done()
    })

    it('Customer.schema is getter only', (done) => {
      let error = null
      try {
        Customer.schema = 222222
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      assert.notEqual(Customer.schema, 222222)
      done()
    })

    it('Customer.Model() must be a function', (done) => {
      let error = null
      assert.equal(typeof Customer.Model, 'function')
      done()
    })

    it('Customer.add() must be a function', (done) => {
      let error = null
      assert.equal(typeof Customer.add, 'function')
      done()
    })
    it('Calling Customer.add() without parameter must returns an error', (done) => {
      ;(async function () {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.add()
          if (error) {
            _error = error
          } else {
            _data = data
          }
        } catch (e) {
          _error = e
          _data = null
        }
        // assert.equal(typeof Customer.add, 'function')
        assert.notEqual(_error, null)
        assert.equal(_data, null)
        assert.equal(_error, 'You must pass a valid JSON document as parameter to to DataEntity.add() method')
        done()
      })()
    })
    it('Calling Customer.edit() without parameter must returns an error', (done) => {
      ;(async function () {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.edit()
          if (error) {
            _error = error
          } else {
            _data = data
          }
        } catch (e) {
          _error = e
          _data = null
        }
        assert.notEqual(_error, null)
        assert.equal(_data, null)
        assert.equal(_error, 'You must pass a valid JSON document as parameter to to DataEntity.edit() method')
        done()
      })()
    })
    it('Customer.edit() must be a function', (done) => {
      let error = null
      assert.equal(typeof Customer.edit, 'function')
      done()
    })
    it('Customer.delete() must be a function', (done) => {
      let error = null
      assert.equal(typeof Customer.delete, 'function')
      done()
    })
    it('Customer.findById() must be a function', (done) => {
      let error = null
      assert.equal(typeof Customer.findById, 'function')
      done()
    })
    it('Customer.findById() must be a function', (done) => {
      let error = null
      assert.equal(typeof Customer.findById, 'function')
      done()
    })
    it('Customer.findAll() must be a function', (done) => {
      let error = null
      assert.equal(typeof Customer.findAll, 'function')
      done()
    })
    it('Customer.count() must be a function', (done) => {
      let error = null
      assert.equal(typeof Customer.count, 'function')
      done()
    })


    // ====== PRODUCT 

    it('Product must be instance of DataEntity', (done) => {
      assert.equal(Product instanceof DataEntity, true)
      done()
    })

    it('Product.entity must be equal to "Product"', (done) => {
      assert.equal(Product.entity === 'Product', true)
      done()
    })

    // check all getters only
    it('Product.entity is getter only', (done) => {
      let error = null
      try {
        Product.entity = 222222
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      assert.notEqual(Product.entity, 222222)
      done()
    })

    it('Product.strategy is getter only', (done) => {
      let error = null
      try {
        Product.entity = 222222
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      assert.notEqual(Product.strategy, 222222)
      done()
    })

    it('Product.strategy must be "offlineFirst"', (done) => {
      let error = null
      assert.equal(Product.strategy, 'offlineFirst')
      done()
    })

    it('Product.schema is getter only', (done) => {
      let error = null
      try {
        Product.schema = 222222
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      assert.notEqual(Product.schema, 222222)
      done()
    })


    it('Product.Model() must be a function', (done) => {
      let error = null
      assert.equal(typeof Product.Model, 'function')
      done()
    })
    it('Product.add() must be a function', (done) => {
      let error = null
      assert.equal(typeof Product.add, 'function')
      done()
    })
    it('Calling Product.add() without parameter must returns an error', (done) => {
      ;(async function () {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Product.add()
          if (error) {
            _error = error
          } else {
            _data = data
          }
        } catch (e) {
          _error = e
          _data = null
        }
        // assert.equal(typeof Product.add, 'function')
        assert.notEqual(_error, null)
        assert.equal(_data, null)
        assert.equal(_error, 'You must pass a valid JSON document as parameter to to DataEntity.add() method')
        done()
      })()
    })
    it('Calling Product.edit() without parameter must returns an error', (done) => {
      ;(async function () {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Product.edit()
          if (error) {
            _error = error
          } else {
            _data = data
          }
        } catch (e) {
          _error = e
          _data = null
        }
        assert.notEqual(_error, null)
        assert.equal(_data, null)
        assert.equal(_error, 'You must pass a valid JSON document as parameter to to DataEntity.edit() method')
        done()
      })()
    })
    it('Product.edit() must be a function', (done) => {
      let error = null
      assert.equal(typeof Product.edit, 'function')
      done()
    })
    it('Product.delete() must be a function', (done) => {
      let error = null
      assert.equal(typeof Product.delete, 'function')
      done()
    })
    it('Product.findById() must be a function', (done) => {
      let error = null
      assert.equal(typeof Product.findById, 'function')
      done()
    })
    it('Product.findById() must be a function', (done) => {
      let error = null
      assert.equal(typeof Product.findById, 'function')
      done()
    })
    it('Product.findAll() must be a function', (done) => {
      let error = null
      assert.equal(typeof Product.findAll, 'function')
      done()
    })
    it('Product.count() must be a function', (done) => {
      let error = null
      assert.equal(typeof Product.count, 'function')
      done()
    })
  })

  // new this.Model(doc, this.#_schema)

  
})
