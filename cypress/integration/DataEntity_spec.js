/* global describe it Blob before  after */

import voodux from '../../index.js'
import assert from 'assert'
const { Foundation, LocalDatabaseTransport, DataEntity, utils } = voodux


const Schema = Foundation.Schema

let foundation = null
let Customer = null
let Product = null

const CustomerDocument = {
  name: 'Eduardo Almeida',
  address: 'Boca Raton, FL.',
  email: 'web2solucoes@gmail.com',
  cards: []
}
const ProductDocument = {
  name: 'XC90',
  vendor: 'Volvo',
  price: 80000
}

let NewCustomerDocument = null
let NewProductDocument = null



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
    index: true,
    validate: {
      validator: function(v) {
        return v > 0
      },
      message: props => `Product price must be greater than 0!`
    },
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

    it('Customer.strategy must be "offline"', (done) => {
      let error = null
      assert.equal(Customer.strategy, 'offline')
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
        assert.equal(_error, 'You must pass a valid JSON document as parameter to DataEntity.add() method')
        done()
      })()
    })
    it('Calling Customer.add({}) with empty object must returns an error', (done) => {
      ;(async function () {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.add({})
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
        done()
      })()
    })
    it('Calling Customer.edit() without parameter must returns an  validation error', (done) => {
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
        assert.equal(_error, 'You must pass a valid JSON document as parameter to DataEntity.edit() method')
        done()
      })()
    })
    it('Calling Customer.edit(null) returns an  validation error', (done) => {
      ;(async function () {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.edit(null)
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
        assert.equal(_error, 'You must pass a valid JSON document as parameter to DataEntity.edit() method')
        console.log({ _error, _data })
        done()
      })()
    })
    it('Calling Customer.edit(null, {a: 1}) returns an validation error', (done) => {
      ;(async function () {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.edit(null, {a: 1})
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
        assert.equal(_error, 'You must pass a valid primary key value as parameter to DataEntity.edit() method')
        console.log({ _error, _data })
        done()
      })()
    })
    it('Calling Customer.edit(1, {a: 1}) empty document returns an validation error', (done) => {
      ;(async function () {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.edit(1, {a: 1})
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
        assert.equal(_error, 'Document must have doc.__id (Integer) when calling DataEntity.edit() method')
        console.log({ _error, _data })
        done()
      })()
    })
    it('Calling Customer.edit(1, {__id: 1}) empty document returns an validation error', (done) => {
      ;(async function () {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.edit(1, {__id: 1})
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
        assert.equal(_error, 'Document must have doc._id (ObjectID) when calling DataEntity.edit() method')
        console.log({ _error, _data })
        done()
      })()
    })
    it('Calling Customer.edit(1, {__id: 1, _id: "dffgdfgdfg"}) empty document returns an validation error', (done) => {
      ;(async function () {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.edit(1, {__id: 1, _id: 'dffgdfgdfg'})
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
        // assert.equal(_error, 'Document must have doc._id (ObjectID) when calling DataEntity.edit() method')
        console.log({ _error, _data })
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

    it('Product.strategy must be "offline"', (done) => {
      let error = null
      assert.equal(Product.strategy, 'offline')
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
        assert.equal(_error, 'You must pass a valid JSON document as parameter to DataEntity.add() method')
        done()
      })()
    })
    it('Calling Product.add({}) with empty object must returns an error', (done) => {
      ;(async function () {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Product.add({})
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
        assert.equal(_error, 'You must pass a valid JSON document as parameter to DataEntity.edit() method')
        done()
      })()
    })
    it('Calling Customer.edit(null) returns an error', (done) => {
      ;(async function () {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.edit(null)
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
        done()
      })()
    })
    it('Calling Product.edit(1, {}) empty document returns an error', (done) => {
      ;(async function () {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Product.edit(1, {})
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

  describe('Check data schema implementation', () => {
    it('Check model validation passing an invalid document should shall not to be validated', () => {
      let invalid = null
      const model = new Product.Model({
          name: 'My Product'
      }, productSchema)
      invalid = model.isNotValid()
      assert.equal(!!invalid, true)
    })

    it('Check model validation passing a valid document should shall to be validated', () => {
      let invalid = null
      const model = new Product.Model({
        name: 'My Product',
        vendor: 'The Vendor',
        price: 10
      }, productSchema)
      invalid = model.isNotValid()
      assert.equal(!!invalid, false)
    })

    it('Testing schema.validate method. product.price must be greater than 0', () => {
      let invalid = null
      const model = new Product.Model({
        name: 'My Product',
        vendor: 'The Vendor',
        price: 0
      }, productSchema)
      invalid = model.isNotValid()
      assert.equal(!!invalid, true)
    })
  })

  describe('Check class usage', () => {
    it('We must be able to add new Customer', (done) => {
      ;(async () => {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.add(CustomerDocument)
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }
        // console.log(_error, _data)
        assert.equal(_error, null)

        if (_error) {
          done(_error)
        } else {
          NewCustomerDocument = _data
          done()
        }
      })()
    })

    it('NewCustomerDocument must have valid __id (local ID)', () => {
      assert.equal(typeof NewCustomerDocument.__id, 'number')
    })

    it('NewCustomerDocument must have valid _id (remote ID)', () => {
      assert.equal(typeof NewCustomerDocument._id, 'string')
    })

    
    it('We must be able to add new Product', (done) => {
      ;(async () => {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Product.add(ProductDocument)
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }
        // console.log(_error, _data)
        assert.equal(_error, null)

        if (_error) {
          done(_error)
        } else {
          NewProductDocument = _data
          done()
        }
      })()
    })

    it('NewProductDocument must have valid __id (local ID)', () => {
      assert.equal(typeof NewProductDocument.__id, 'number')
    })

    it('NewProductDocument must have valid _id (remote ID)', () => {
      assert.equal(typeof NewProductDocument._id, 'string')
    })

    it('Customer.findAll must return the added Customer by it name', (done) => {
      ; (async () => {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.findAll({
            name: CustomerDocument.name
          })
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }
        // console.log(_error, _data)

        const found = _data.filter(c => c.name === CustomerDocument.name)
        const doc = found[0] || {}

        assert.equal(doc.name, CustomerDocument.name)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })

    it('Product.findAll must return the added Product by it name', (done) => {
      ; (async () => {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Product.findAll({
            name: ProductDocument.name
          })
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }
        // console.log(_error, _data)

        const found = _data.filter(p => p.name === ProductDocument.name)
        const doc = found[0] || {}

        assert.equal(doc.name, ProductDocument.name)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })


    it('Customer.findAll must return the added Customer ', (done) => {
      ; (async () => {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.findAll()
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }
        // console.log(_error, _data)

        const found = _data.filter(c => c.name === CustomerDocument.name)
        const doc = found[0] || {}

        assert.equal(doc.name, CustomerDocument.name)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })

    it('Product.findAll must return the added Product ', (done) => {
      ; (async () => {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Product.findAll()
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }
        // console.log(_error, _data)

        const found = _data.filter(p => p.name === ProductDocument.name)
        const doc = found[0] || {}

        assert.equal(doc.name, ProductDocument.name)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })

    it('Customer.find must return the added Customer by it name', (done) => {
      ; (async () => {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.find({
            name: CustomerDocument.name
          })
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }
        // console.log(_error, _data)

        const found = _data.filter(c => c.name === CustomerDocument.name)
        const doc = found[0] || {}

        assert.equal(doc.name, CustomerDocument.name)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })

    it('Product.find must return the added Product by it name', (done) => {
      ; (async () => {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Product.find({
            name: ProductDocument.name
          })
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }
        // console.log(_error, _data)

        const found = _data.filter(p => p.name === ProductDocument.name)
        const doc = found[0] || {}

        assert.equal(doc.name, ProductDocument.name)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })

    it('Customer.find must return the added Customer ', (done) => {
      ; (async () => {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.find()
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }
        // console.log(_error, _data)

        const found = _data.filter(c => c.name === CustomerDocument.name)
        const doc = found[0] || {}

        assert.equal(doc.name, CustomerDocument.name)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })

    it('Product.find must return the added Product ', (done) => {
      ; (async () => {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Product.find()
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }
        // console.log(_error, _data)

        const found = _data.filter(p => p.name === ProductDocument.name)
        const doc = found[0] || {}

        assert.equal(doc.name, ProductDocument.name)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })

    it('Customer.findById must return the added Customer ', (done) => {
      ; (async () => {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Customer.findById(NewCustomerDocument.__id)
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }

        assert.equal(_data.name, CustomerDocument.name)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })

    it('Product.findById must return the added Product ', (done) => {
      ; (async () => {
        let _error = null
        let _data = null
        try {
          const { error, data } = await Product.findById(NewProductDocument.__id)
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }

        assert.equal(_data.name, ProductDocument.name)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })

    it('We must be able to edit the added Product', (done) => {
      ;(async () => {
        let _error = null
        let _data = null
        let doc = null
        try {
          doc = {
            ...NewProductDocument
          }
          doc.name = 'XC60'
          const {
            error,
            data
          } = await Product.edit(NewProductDocument.__id, doc)
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
          doc = null
        }
        // console.log(_error, _data)
        assert.equal(_error, null)
        assert.equal(_data.name, doc.name)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })

    it('We must be able to edit the added Customer', (done) => {
      ;(async () => {
        let _error = null
        let _data = null
        let doc = null
        try {
          doc = {
            ...NewCustomerDocument
          }
          doc.name = 'José Eduardo Almeida'
          const {
            error,
            data
          } = await Customer.edit(NewCustomerDocument.__id, doc)
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
          doc = null
        }
        // console.log(_error, _data)
        assert.equal(_error, null)
        assert.equal(_data.name, doc.name)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })

    it('We must be able to count Customer by name', (done) => {
      ;(async () => {
        let _error = null
        let _data = null
        let doc = null
        try {
          const {
            error,
            data
          } = await Customer.count({
            name: 'José Eduardo Almeida'
          })
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
          doc = null
        }
        // console.log(_error, _data)
        assert.equal(_error, null)
        assert.equal(_data, 1)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })

    it('We must be able to count Product by name', (done) => {
      ;(async () => {
        let _error = null
        let _data = null
        let doc = null
        try {
          const {
            error,
            data
          } = await Product.count({
            name: 'XC60'
          })
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
          doc = null
        }
        // console.log(_error, _data)
        assert.equal(_error, null)
        assert.equal(_data, 1)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })


    it('We must be able to count Customer', (done) => {
      ;(async () => {
        let _error = null
        let _data = null
        let doc = null
        try {
          const {
            error,
            data
          } = await Customer.count()
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
          doc = null
        }
        // console.log(_error, _data)
        assert.equal(_error, null)
        assert.equal(_data, 1)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })

    it('We must be able to count Product', (done) => {
      ;(async () => {
        let _error = null
        let _data = null
        let doc = null
        try {
          const {
            error,
            data
          } = await Product.count()
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
          doc = null
        }
        // console.log(_error, _data)
        assert.equal(_error, null)
        assert.equal(_data, 1)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })
    
    it('We must be able to delete the added Product', (done) => {
      ;(async () => {
        let _error = null
        let _data = null
        let doc = null
        try {
          const {
            error,
            data
          } = await Product.delete(NewProductDocument.__id)
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
          doc = null
        }
        // console.log(_error, _data)
        assert.equal(_error, null)
        assert.equal(_data.__id, NewProductDocument.__id)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })
    

    it('We must be able to delete the added Customer', (done) => {
      ;(async () => {
        let _error = null
        let _data = null
        let doc = null
        try {
          const {
            error,
            data
          } = await Customer.delete(NewCustomerDocument.__id)
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
          doc = null
        }
        // console.log(_error, _data)
        assert.equal(_error, null)
        assert.equal(_data.__id, NewCustomerDocument.__id)

        if (_error) {
          done(_error)
        } else {
          done()
        }
      })()
    })
  })

  describe('Check data event changes', () => {
    it('Product.add() must triggers add event', (done) => {
      ; (async () => {
        let _error = null
        let _data = null
        let listener = Product.on('add', (eventObj) => {
          const { error, document, foundation, data } = eventObj
          assert.equal(_error, null)
          assert.equal(error, null)
          assert.equal(data.name, ProductDocument.name)
          Product.stopListenTo(listener)
          if (_error) {
            done(_error)
          } else {
            NewProductDocument = _data
            done()
          }

        })
        try {
          const { error, data } = await Product.add(ProductDocument)
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }
        // console.log(_error, _data)
      })()
    })
    it('Product.edit() must triggers edit event', (done) => {
      ; (async () => {
        let _error = null
        let _data = null

        let listener = Product.on('edit', async (eventObj) => {
          console.log('---->edit', eventObj)
          const { error, document, foundation, data } = eventObj
          assert.equal(_error, null)
          assert.equal(error, null)
          assert.equal(data.name, 'XC90 T6')
          Product.stopListenTo(listener)
          await Product.delete(data.__id)
          if (_error) {
            done(_error)
          } else {
            NewProductDocument = _data
            done()
          }
        })
        try {
          let add = await Product.add(ProductDocument)
          add.data.name = 'XC90 T6'
          let { error, data } = await Product.edit(add.data.__id, add.data)
          _error = error
          _data = data
        } catch (e) {
          _error = e
          _data = null
        }
        console.log(_error, _data)
      })()
    })
  })

  it('We must be able to delete database', (done) => {
      ; (async function () {
        let _error = null
        try {
          // create the foundation
          await foundation.localDatabaseTransport.delete()
        } catch (e) {
          _error = e
        }
        assert.equal(_error, null)
        done()
      })()
    })
})
