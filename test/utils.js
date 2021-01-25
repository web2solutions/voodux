/* global describe, it */

import * as utils from '../src/utils'
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
})
