/* global describe, it, before */

import LocalDatabaseTransport from '../src/foundation/LocalDatabaseTransport'
import { Schema } from '../src/foundation/utils'
import assert from 'assert'

describe('#--- LocalDatabaseTransport Class Test Suite', () => {
  let localDataTransport = null
  const UserSchema = new Schema({
    name: {
      type: String,
      required: true,
      index: true
    },
    username: {
      type: String,
      required: true
    }
  })

  let bulkInsertedIds = []
  const userDoc1 = {
    // __id: 1,
    name: 'James1',
    username: 'james2@james.com'
  }

  const userDoc2 = {
    name: 'Mary',
    username: 'mary@mary.com'
  }
  let userAddedId1 = 0
  let userAddedId2 = 0

  before(function (done) {
    (async function () {
      try {
        localDataTransport = new LocalDatabaseTransport({
          version: 2,
          tables: {},
          dbName: 'MyTestDatabase'
        })
        localDataTransport.addSchema('User', UserSchema)
        await localDataTransport.connect()
        done()
      } catch (error) {
        // console.log('>>>>>>>>>', error)
        done(error)
      }
    })()
  })

  describe('Check class integrity', () => {
    it('LocalDatabaseTransport must have a constructor', (done) => {
      assert.equal(LocalDatabaseTransport.constructor, Function)
      done()
    })
    it('localDataTransport must be instance of LocalDatabaseTransport', (done) => {
      assert.equal(localDataTransport instanceof LocalDatabaseTransport, true)
      done()
    })
  })

  describe('Check Internal Data API', async () => {
    it('We cannot to add new Data Schemas to schemas tree after connection', (done) => {
      let error = {}
      try {
        const UserFakeSchema = new Schema({
          name: {
            type: String,
            required: true
          },
          username: {
            type: String,
            required: true
          }
        })
        localDataTransport.addSchema('UserFake', UserFakeSchema)
        localDataTransport.table('UserFake')
        // table.name
      } catch (e) {
        error = e
      }
      assert.equal(error.message, 'Table UserFake does not exist')
      done()
    })
    it('Internal Data API - We must be able to add user #1 to local database', (done) => {
      (async function () {
        let __id = null
        let e = null
        try {
          __id = await localDataTransport.table('User').add(userDoc1)
          userAddedId1 = __id
        } catch (error) {
          console.error(error)
          e = error
        }
        assert.equal(__id === 1, true)
        assert.equal(e === null, true)
        done()
      })()
    })
    it('Internal Data API - We must be able to add user #2 to local database', (done) => {
      (async function () {
        let __id = null
        let e = null
        try {
          __id = await localDataTransport.table('User').add(userDoc2)
          userAddedId2 = __id
        } catch (error) {
          console.error(error)
          e = error
        }
        assert.equal(__id === 2, true)
        assert.equal(e === null, true)
        done()
      })()
    })
    it('Internal Data API - We must be able to edit the added user on local database', (done) => {
      (async function () {
        let __id = null
        let e = null
        try {
          userDoc1.name = 'Orion'
          __id = await localDataTransport.table('User').put({ __id: userAddedId1, ...userDoc1 })
        } catch (error) {
          // console.error(error)
          e = error
        }
        assert.equal(__id === 1, true)
        assert.equal(e === null, true)
        done()
      })()
    })
    it('Internal Data API - We must be able to find the added user by it ID', (done) => {
      (async function () {
        let doc = null
        let e = null
        try {
          userDoc1.name = 'Orion'
          doc = await localDataTransport.table('User').get(userAddedId1)
          // console.error('doc:::::::::::', doc)
        } catch (error) {
          // console.error(error)
          e = error
        }
        assert.equal(typeof doc === 'object', true)
        assert.equal(doc.name, 'Orion')
        assert.equal(e === null, true)
        done()
      })()
    })
    it('Internal Data API - We must be able to find the added user by it name', (done) => {
      (async function () {
        let doc = null
        let e = null
        try {
          doc = await localDataTransport.table('User').where({ name: userDoc1.name }).first()
          // console.error('>>>>>>>>>>doc:::::::::::', doc)
        } catch (error) {
          // console.error(error)
          e = error
        }
        assert.equal(typeof doc === 'object', true)
        assert.equal(doc.name, 'Orion')
        assert.equal(e === null, true)
        done()
      })()
    })
    it('Internal Data API - We must not be able to find the added user by it username because it is not indexed', (done) => {
      (async function () {
        let doc = null
        let e = null
        try {
          doc = await localDataTransport.table('User').where({ username: userDoc1.username }).first()
        } catch (error) {
          // console.error(error)
          e = error
        }
        assert.equal(doc, null)
        assert.equal(e.message, 'KeyPath username on object store User is not indexed')
        done()
      })()
    })
    it('Internal Data API - We must be able to find the added user by it name under reverse order', (done) => {
      (async function () {
        let docs = null
        let e = null
        try {
          docs = await localDataTransport.table('User').toCollection().reverse().toArray()
          // console.error('>>>>>>>>+-=-=++++++ doc', docs)
        } catch (error) {
          // console.error('>>>>>>>>+-=-=++++++ error', error)
          e = error
        }
        assert.equal(docs[1].name, userDoc1.name)
        assert.equal(e, null)
        done()
      })()
    })
    it('Internal Data API - We must be able to delete the added user #1 from local database', (done) => {
      (async function () {
        let docs = null
        let doc = null
        let e = null
        try {
          docs = await localDataTransport.table('User').delete(userAddedId1)
          doc = await localDataTransport.table('User').get(userAddedId1)
        } catch (error) {
          // console.error('>>>>>>>>+-=-=++++++ error', error)
          e = error
        }
        assert.equal(typeof docs, 'undefined')
        assert.equal(typeof doc, 'undefined')
        assert.equal(e, null)
        done()
      })()
    })
    it('Internal Data API - We must be able to delete the added user #2 from local database', (done) => {
      (async function () {
        let docs = null
        let doc = null
        let e = null
        try {
          docs = await localDataTransport.table('User').delete(userAddedId2)
          doc = await localDataTransport.table('User').get(userAddedId2)
        } catch (error) {
          // console.error('>>>>>>>>+-=-=++++++ error', error)
          e = error
        }
        assert.equal(typeof docs, 'undefined')
        assert.equal(typeof doc, 'undefined')
        assert.equal(e, null)
        done()
      })()
    })
    it('Internal Data API - We must be able to bulk add users to local database', (done) => {
      (async function () {
        let __ids = null
        let e = null
        try {
          __ids = await localDataTransport.table('User').bulkAdd([
            userDoc1,
            userDoc2
          ], false, { allKeys: true })
          // console.error('>>>>>>>>>>>__ids', __ids)
          bulkInsertedIds = __ids
        } catch (error) {
          // console.error(error)
          e = error
        }
        assert.equal(__ids[0], 1)
        assert.equal(__ids[1], 2)
        assert.equal(e === null, true)
        done()
      })()
    })
    it('Internal Data API - We must be able to bulk edit users in local database', (done) => {
      (async function () {
        let __ids = null
        let e = null
        let doc1 = null
        let doc2 = null
        userDoc1.name = 'Nebulosa'
        userDoc2.name = 'Betelgeuse'
        try {
          __ids = await localDataTransport.table('User').bulkPut([
            userDoc1,
            userDoc2
          ], false, { allKeys: true })
          doc1 = await localDataTransport.table('User').get(__ids[0])
          doc2 = await localDataTransport.table('User').get(__ids[1])
          // console.error('>>>>>>>>>>>__ids', __ids)
          // console.error('>>>>>>>>>>>doc1', doc1)
        } catch (error) {
          // console.error(error)
          e = error
        }
        assert.equal(__ids[0], 1)
        assert.equal(__ids[1], 2)
        assert.equal(doc1.name, userDoc1.name)
        assert.equal(doc2.name, userDoc2.name)
        assert.equal(e === null, true)
        done()
      })()
    })
    it('Internal Data API - We must be able to bulk delete users from local database', (done) => {
      (async function () {
        let __ids = null
        let e = null
        let doc1 = null
        let doc2 = null
        try {
          __ids = await localDataTransport.table('User').bulkDelete([...bulkInsertedIds])
          doc1 = await localDataTransport.table('User').get(bulkInsertedIds[0])
          doc2 = await localDataTransport.table('User').get(bulkInsertedIds[1])
          // console.error('>>>>>>>>>>>bulkInsertedIds', bulkInsertedIds)
        } catch (error) {
          // console.error(error)
          e = error
        }
        assert.equal(typeof __ids, 'undefined')
        assert.equal(typeof doc1, 'undefined')
        assert.equal(typeof doc2, 'undefined')
        assert.equal(e === null, true)
        done()
      })()
    })
  })
})
