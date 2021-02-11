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


describe('#--- DataEntity Class Test Suite', () => {
  const Schema = Foundation.Schema

  let foundation = null
  let Customer = null
  
  before(function (done) {
    ;(async function () {
      try {
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

        foundation = new Foundation({
          name: 'My Test app',
          schemas: {
            Customer: schema
          }
        })

        await foundation.start()

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
  })

  // new this.Model(doc, this.#_schema)

  
})
