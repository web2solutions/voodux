
import dexie from 'dexie'
import 'dexie-mongoify'
import { createMethodSignature, mongooseToDexieTableString } from './utils'

/**
 * @author Eduardo Perotta de Almeida <web2solucoes@gmail.com>
 * @Class LocalDatabaseTransport
 * @description Database transport for IndexedDB
 * @extends dexie
 * @see The Data Transport is set into the {@link Foundation} stack and it is consumed inside {@link DataAPI} to persist data locally. 
 * @see {@link LocalDatabaseTransport} extends {@link https://dexie.org/docs/Dexie/Dexie|Dexie} as database handler for IndexedDB. See {@link https://dexie.org/docs/Dexie/Dexie|Dexie}
 * @param  {object} config - Transport configuration
 * @param  {number} config.version - Database version. <br>Same as IndexedDB database version.
 * @param  {object} config.tables - Database tables. <br>Dexie tables configuration.
 * @param  {string} config.dbName - Database name. <br>Same as IndexedDB database name.
 * @example {@lang javascript}
    import LocalDatabaseTransport from './LocalDatabaseTransport'
    import mongoose from 'mongoose'
    
    const UserSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true
      }
    })

    const ProductSchema = new mongoose.Schema({
      // ...
    })

    const dbName = 'MyDatabaseName'

    const localDataTransport = new LocalDatabaseTransport({
      version: 1,   // default 1
      tables: {},   // default {}
      dbName
    })

    // or 

    const localDataTransport = new LocalDatabaseTransport({ dbName })
    
    localDataTransport.addSchema('User', UserSchema)

    localDataTransport.addSchema('Product', ProductSchema)

    await localDataTransport.connect()
    
    const Biden = await localDataTransport.table('User').add({ name: 'Joe Biden', username: 'biden'})
    
    const Ferrari = await localDataTransport.table('Product').add({ name: 'Ferrari', vendor: 'Ferrari', price_cost: 3000000})
 */

export default class LocalDatabaseTransport extends dexie {
  #_version
  #_tables
  #_connected
  #_schemas
  #_dbName
  constructor ({ version = 1, tables = {}, dbName = 'DatabaseName' } = {}) {
    console.error('STARTED LocalDatabaseTransport')
    // run the super constructor Dexie(databaseName) to create the IndexedDB
    // database.
    super(dbName)
    this.#_dbName = dbName
    this.#_version = version
    this.#_tables = tables
    this.#_connected = false
    this.#_schemas = {}
  }

  // schema name, mongoose schema
  addSchema (schemaName, schema) {
    this.#_schemas[schemaName] = schema
  }

  async connect () {
    for (const entity in this.#_schemas) {
      if (Object.prototype.hasOwnProperty.call(this.#_schemas, entity)) {
        // console.error(entity)
        this.#_tables[entity] = mongooseToDexieTableString(
          this.#_schemas[entity]
        )
      }
    }
    // console.log(this.#_schemas)
    // console.log(this.#_tables)
    console.error('         CONNECTED           ')
    this.version(this.#_version).stores(this.#_tables)

    // we can retrieve our todos store with Dexie.table, and then use it as a
    // field on our Database class for convenience; we can now write code such
    // as "this.todos.add(...)" rather than "this.table('todos').add(...)"
    // this.todos = this.table('todos')
    for (const tableName in this.#_tables) {
      this[tableName] = this.table(tableName)
    }

    const open = await this.open()
    // console.debug('open', open)
  }
}
