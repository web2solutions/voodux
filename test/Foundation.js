/* global describe it Blob before */

// import agnostic foundation foundation class
import Foundation from '../src/foundation/Foundation'

// import mongoose like data schemas
import UserSchema from '../src/schemas/User'
import ProductSchema from '../src/schemas/Product'
import OrderSchema from '../src/schemas/Order'
import CustomerSchema from '../src/schemas/Customer'

import assert from 'assert'

describe('#--- Foundation Class Test Suite', () => {
  let name = 'My App'
  let foundation = null
  const jsonSchema = {
    name: {
      type: String,
      required: true,
      index: true
    },
    username: {
      type: String,
      required: true,
      index: true
    }
  }
  before(function (done) {
    (async function () {
      try {
        foundation = new Foundation({
          name,
          useWorker: true,
          dataStrategy: 'offlineFirst',
          schemas: {
            User: UserSchema,
            Product: ProductSchema,
            Order: OrderSchema,
            Customer: CustomerSchema
          }
        })
        await foundation.start()
        done()
      } catch (error) {
        // console.log('>>>>>>>>>', error)
        done(error)
      }
    })()
  })
  describe('Check class integrity', async () => {
    it('Foundation must have a constructor', (done) => {
      assert.equal(Foundation.constructor, Function)
      done()
    })
    it('foundation must be instance of Foundation', (done) => {
      assert.equal(foundation instanceof Foundation, true)
      done()
    })

    it('Foundation.Schema static method must return a constructor', (done) => {
      // console.log(foundation)
      // console.log(Object.keys(foundation))
      assert.equal(Foundation.Schema.constructor, Function)
      done()
    })

    it('Foundation.Schema static method must create a Mongoose like schema', (done) => {
      // console.log(foundation)
      // console.log(Object.keys(foundation))
      const schema = new Foundation.Schema(jsonSchema)
      assert.equal(typeof schema.obj === 'object', true)
      assert.equal(typeof schema.paths === 'object', true)
      assert.equal(Object.keys(jsonSchema).reverse().join(','), Object.keys(schema.paths).reverse().join(',').replace(/_id,/gi, ''))
      done()
    })

    it('foundation.name getter must return the application name', (done) => {
      // console.log(foundation)
      // console.log(Object.keys(foundation))
      assert.equal(typeof foundation.name === 'string', true)
      assert.equal(foundation.name, name)
      done()
    })

    it('foundation.name setter must set the application name', (done) => {
      // console.log(foundation)
      // console.log(Object.keys(foundation))
      const newName = 'My New App Name'
      foundation.name = newName
      assert.equal(typeof foundation.name === 'string', true)
      assert.equal(foundation.name, newName)
      done()
    })

    it('foundation.guid getter must return the application UUID string', (done) => {
      assert.equal(typeof foundation.guid === 'string', true)
      done()
    })

    it('foundation.getGuidStorage() method must return the application UUID string.', (done) => {
      const guid = foundation.getGuidStorage()
      // console.log('uid ---->', guid)
      const bytes = new Blob([guid]).size
      assert.equal(typeof guid === 'string', true)
      assert.equal(bytes, 36)
      done()
    })

    // foundation.getGuidStorage()

    it('foundation.guid getter must return a 36 bytes string', (done) => {
      const bytes = new Blob([foundation.guid]).size
      assert.equal(bytes, 36)
      done()
    })

    it('foundation.guid is getter only', (done) => {
      let error = null
      try {
        foundation.guid = 22222
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      assert.notEqual(foundation.guid, 22222)
      done()
    })

    it('foundation.tabId getter must return the session UUID string. Each browser tab is considered a different session.', (done) => {
      assert.equal(typeof foundation.tabId === 'string', true)
      done()
    })

    it('foundation.tabId getter must return a 36 bytes string', (done) => {
      const bytes = new Blob([foundation.tabId]).size
      assert.equal(bytes, 36)
      done()
    })

    it('foundation.data is getter only', (done) => {
      let error = null
      try {
        foundation.data = 'string text'
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      done()
    })

    it('foundation.dataStrategy is getter only', (done) => {
      let error = null
      try {
        foundation.dataStrategy = 222222
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      done()
    })

    it('foundation.dataStrategy is getter only', (done) => {
      let error = null
      try {
        foundation.dataStrategy = 222222
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      done()
    })

    it('foundation.tabId is getter only', (done) => {
      let error = null
      try {
        foundation.tabId = 222222
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      done()
    })
  })
})
