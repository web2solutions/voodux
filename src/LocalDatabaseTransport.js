
import Dexie from 'dexie'
import { createMethodSignature, mongooseToDexieTableString } from './utils'

/**
 * @Class LocalDatabaseTransport
 * @description Database transport for IndexedDB
 * @extends dexie
 * @param  {object} config - Transport configuration
 * @param  {number} config.version - Database version. <br>Same as IndexedDB database version.
 * @param  {object} config.tables - Database tables. <br>Dexie tables configuration.
 * @param  {string} config.dbName - Database name. <br>Same as IndexedDB database name.
 * @example
    import LocalDatabaseTransport from './LocalDatabaseTransport'

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

    const localDataTransport = new LocalDatabaseTransport({
      version: 1,
      tables: {},
      dbName: 'MyDatabaseName'
    })

    foundation.on('application:start', function (eventObj){
      const { application, data, error } = eventObj
 
      if (error) {
        throw new Error(`Error starting application stack: ${error}`)
      }

      const userCollection = application.data.get('User')
      console.log(userCollection)
      await userCollection.add()

    })

    await foundation.start()
 */

export default class LocalDatabaseTransport extends Dexie {
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
        console.error(entity)
        this.#_tables[entity] = mongooseToDexieTableString(
          this.#_schemas[entity]
        )
      }
    }
    console.log(this.#_schemas)
    console.log(this.#_tables)
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
    console.debug('open', open)
  }
}
