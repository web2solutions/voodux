import Foundation from './src/Foundation'
import DataEntity from './src/DataEntity'
import LocalDatabaseTransport from './src/LocalDatabaseTransport'
import * as utils from './src/utils'

/* if (typeof window !== 'undefined') {
  window.Foundation = Foundation
  window.utils = utils
  window.LocalDatabaseTransport = LocalDatabaseTransport
  window.DataEntity = DataEntity
} */

exports = exports || {}
exports.Foundation = Foundation
exports.DataEntity = DataEntity
exports.LocalDatabaseTransport = LocalDatabaseTransport
exports.utils = utils

