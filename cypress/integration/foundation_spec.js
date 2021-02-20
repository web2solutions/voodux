/* global describe it Blob before Foundation */

import voodux from '../../index.js'
import assert from 'assert'
const { Foundation, LocalDatabaseTransport, DataEntity, utils } = voodux

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
  before(function () {
    foundation = new Foundation({
      name,
      schemas: {
        User: UserSchema,
        Product: ProductSchema,
        Order: OrderSchema,
        Customer: CustomerSchema
      }
    })
  })
  describe('Check class integrity', async () => {
    it('Foundation must starts', (done) => {
      ; (async () => {
        const { error, data } = await foundation.start()
        assert.equal(error, null)
        assert.notEqual(data, null)
        if (error) {
          done(error)
        } else {
          done()
        }
      })()
    })
    it('Double starts the Foundation shall to raise an error', (done) => {
      ; (async () => {
        const { error, data } = await foundation.start()
        console.log({ error, data })
        assert.notEqual(error, null)
        assert.equal(data, null)
        done()
      })()
    })
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
      assert.equal(
        Object.keys(jsonSchema)
          .reverse()
          .join(','),
        Object.keys(schema.paths)
          .reverse()
          .join(',')
          .replace(/_id,/gi, '')
      )
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
      console.log('xxxxxxxxxx', foundation.guid)
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
      assert.notEqual(foundation.data, 'string text')
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
      assert.notEqual(foundation.dataStrategy, 222222)
      done()
    })

    it('foundation.started is getter only', (done) => {
      let error = null
      try {
        foundation.started = 222222
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      assert.notEqual(foundation.started, 222222)
      done()
    })

    it('foundation.applicationWorker is getter only', (done) => {
      let error = null
      try {
        foundation.applicationWorker = 222222
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      assert.notEqual(foundation.applicationWorker, 222222)
      done()
    })


    it('foundation.useWorker is getter only', (done) => {
      let error = null
      try {
        foundation.useWorker = 222222
      } catch (e) {
        error = e
      }
      assert.equal(error !== null, true)
      assert.equal(typeof error === 'object', true)
      assert.notEqual(foundation.useWorker, 222222)
      done()
    })

    it('Foundation.Schema is static', (done) => {
      assert.equal(typeof Foundation.Schema, 'function')
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
