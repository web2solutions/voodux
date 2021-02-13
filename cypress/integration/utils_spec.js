/* global describe it Blob before */

// import agnostic foundation foundation class
import '../../dist/main.js'
import assert from 'assert'
describe('#--- Utils module Test Suite', () => {
  describe('Method Signatures: utils.createMethodSignature(error: string|object, data: string|object|array|boolean) -> Create default signature method object', () => {
    it('method signatures should have at least 2 data properties', (done) => {
      const _error = 'fake error'
      const _data = 'fake data'
      const signature = utils.createMethodSignature(_error, _data)
      assert.equal(Object.keys(signature).length, 2)
      done()
    })

    it('method signatures should have error and data properties', (done) => {
      const _error = 'fake error'
      const _data = 'fake data'
      const signature = utils.createMethodSignature(_error, _data)
      assert.equal(signature.data, _data)
      assert.equal(signature.error, _error)
      done()
    })

    it('method signatures should have error and data properties even if you dont pass any parameter', (done) => {
      const signature = utils.createMethodSignature()
      assert.equal(signature.data, null)
      assert.equal(signature.error, null)
      done()
    })
  })

  describe('UUID: utils.uuid() -> Generate an Universally unique identifier string', () => {
    it('uuid() must have 36 length', (done) => {
      const uuid1 = utils.uuid()
      const uuid2 = utils.uuid()
      assert.equal(uuid1.length, 36)
      assert.equal(uuid2.length, 36)
      done()
    })

    it('uuid() getter must return a 36 bytes string', (done) => {
      const uuid1 = utils.uuid()
      const bytes = new Blob([uuid1]).size
      assert.equal(bytes, 36)
      done()
    })

    it('Generates 10,000 uuids and check collisions', (done) => {
      const arr = []
      for (let x = 0; x <= 10000; x++) {
        const uuid = utils.uuid()
        arr.push(uuid)
      }
      // console.log(arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {}))
      const map = arr.reduce(
        (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
        new Map()
      )

      // console.info([...map.keys()])
      const oneOcurrency = 1
      const similars = [...map.values()].filter((value) => value > oneOcurrency)
        .length
      assert.equal(similars, 0)
      done()
    })
  })

  describe('toJSON: utils.toJSON(string|object) -> stringify and parse an object', () => {
    it('toJSON() must support Strings', (done) => {
      const obj = '{ "name": "eduardo" }'
      const json = utils.toJSON(obj)
      assert.equal(json.name, 'eduardo')
      done()
    })

    it('toJSON() Strings must be valid JSON string', (done) => {
      const obj = '{ name: "eduardo" }'
      let json = {}
      try {
        json = utils.toJSON(obj)
      } catch (error) {
        json = {}
      }
      assert.notEqual(json.name, 'eduardo')
      done()
    })

    it('toJSON() must support Object', (done) => {
      const obj = { name: 'eduardo' }
      const json = utils.toJSON(obj)
      assert.equal(json.name, 'eduardo')
      done()
    })
  })

  describe('Mongoose 2 Dexie: utils.mongooseToDexieTableString(schema) -> Mongoose schema conversion to Dexie table config', () => {
    const schema = new utils.Schema({
      name: {
        type: String,
        required: true,
        index: true
      },
      username: {
        type: String,
        required: true,
        index: true
      },
      cards: {
        type: [],
        required: true,
        index: true
      },
      notIndexed: {
        type: String,
        required: true
      }
    })
    const tableConfig = utils.mongooseToDexieTableString(schema)
    it('Table config must have __id as Primary Key', (done) => {
      const tableConfigArray = tableConfig.split(',')
      assert.equal(tableConfigArray[0], '++__id')
      done()
    })
    it('Table config must have _id ', (done) => {
      const tableConfigArray = tableConfig.split(',')
      assert.equal(tableConfigArray[1], '_id')
      done()
    })
    it('cards property must be multi entry', (done) => {
      const tableConfigArray = tableConfig.split(',')
      let foundMultiEntry = false
      tableConfigArray.forEach(propertyName => {
        if (propertyName === '*cards') {
          foundMultiEntry = true
        }
      })
      assert.equal(foundMultiEntry, true)
      done()
    })
    it('notIndexed property shall not be present on table config because it is not indexed', (done) => {
      const tableConfigArray = tableConfig.split(',')
      let foundnotIndexed = false
      tableConfigArray.forEach(propertyName => {
        if (propertyName === 'notIndexed') {
          foundnotIndexed = true
        }
      })
      assert.equal(foundnotIndexed, false)
      done()
    })
  })

  describe('lunr search token generating', () => {
    it('Returned token must be an array', (done) => {
      let _error = null
      let _data = null
      try {
        const text = 'text goes here'
        const token = utils.getSearchTokenStream(text)
        _data = token
      } catch (e) {
        console.log(e)
        _error = e
        _data = null
      }
      assert.equal(Array.isArray(_data), true)
      done()
    })

    it('Returned token must have 3 entries', (done) => {
      let _error = null
      let _data = null
      try {
        const text = 'text goes here'
        const token = utils.getSearchTokenStream(text)
        _data = token
      } catch (e) {
        console.log(e)
        _error = e
        _data = null
      }
      assert.equal(_data.length, 3)
      done()
    })
    it('Returned token must have 0 entries', (done) => {
      let _error = null
      let _data = null
      try {
        const text = ''
        const token = utils.getSearchTokenStream(text)
        _data = token
      } catch (e) {
        console.log(e)
        _error = e
        _data = null
      }
      assert.equal(_data.length, 0)
      done()
    })
  })

  // getSearchTokenStream

})
