
import dexie from 'dexie'
import 'dexie-mongoify'
import { createMethodSignature, mongooseToDexieTableString } from './utils'

dexie.debug = false

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
    import { Schema } from './utils'
    
    const UserSchema = new Schema({
      name: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true
      }
    })

    const ProductSchema = new Schema({
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
    // console.error('STARTED LocalDatabaseTransport')
    // run the super constructor Dexie(databaseName) to create the IndexedDB
    // database.
    super(dbName)
    this.#_dbName = dbName
    this.#_version = version
    this.#_tables = tables
    this.#_connected = false
    this.#_schemas = {}
  }

  #_setTables() {
    for (const entity in this.#_schemas) {
      if (Object.prototype.hasOwnProperty.call(this.#_schemas, entity)) {
        // console.error(entity)
        this.#_tables[entity] = mongooseToDexieTableString(
          this.#_schemas[entity]
        )
      }
    }
  }

  /**
   * @Method LocalDatabaseTransport.addSchema
   * @description A a Data Schema into the Schema tree
   * @param  {string} schemaName - The schema name. Same as Entity name.
   * @param  {object} schema - A valid mongoose like schema
   * @example 
      const UserSchema = new Schema({
        name: {
          type: String,
          required: true
        },
        username: {
          type: String,
          required: true
        }
      })
      localDataTransport.addSchema('User', UserSchema)
   * @return  {object} schema - The schema enty from inside the Schema tree
   */
  addSchema (schemaName, schema) {
    this.#_schemas[schemaName] = schema
    return this.#_schemas[schemaName]
  }

  /**
   * @async 
   * @Method LocalDatabaseTransport.connect
   * @description Setup connection to local database
   * @return Foundation GUID saved on localStorage
   * @example 
        await localDataTransport.connect()
   * @return  {object} signature - Default methods signature format { error, data }
   * @return  {string|object} signature.error - Execution error information
   * @return  {object} signature.data - Connection information
   */
  async connect() {
    let error = null
    let data = null
    try {
      this.#_setTables()
    
      this
        .version(this.#_version)
          .stores(this.#_tables)

      // for (const tableName in this.#_tables) {
      //  this[tableName] = this.table(tableName)
      // }

      const open = await this.open()
      data = open
    } catch (e) {
      error = e
      data = null
    }
    return createMethodSignature(error, data)
  }
}
