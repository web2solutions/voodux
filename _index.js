import Foundation from './src/Foundation'
import DataEntity from './src/DataEntity'
import LocalDatabaseTransport from './src/LocalDatabaseTransport'
import * as utils from './src/utils'

if (typeof window !== 'undefined') {
  window.voodux = {
    Foundation,
    utils,
  }
  window.Foundation = Foundation
  window.utils = utils
}

if (typeof exports !== 'undefined') {
  exports = exports || {}
  exports.Foundation = Foundation
  exports.DataEntity = DataEntity
  exports.LocalDatabaseTransport = LocalDatabaseTransport
  exports.utils = utils
}




