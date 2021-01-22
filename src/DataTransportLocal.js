'use strict'

// mixin
const DataTransportLocal = (DataTransportLocal) =>
  /**
   * @Class DataTransportLocal
   * @description Local transport for DataAPI saving data to IndexedDB
   */

  class extends DataTransportLocal {
    /**
     * @Method DataTransportLocal.addLocal
     * @description addLocal a new document to the storage
     * @param  {object} doc - A valid document validated against mongoose model
     * @return  {object} signature - Default methods signature format { error, data }
     * @return  {string|object} signature.error - Execution error
     * @return  {object} signature.data - Created document
    */
    #strategy
    #entity
    async addLocal (doc) {
      // xxxx
      console.log(this.#entity, this.#strategy)
    }

    /**
     * @Method DataTransportLocal.editLocal
     * @description Edit a document on the storage
     * @param  {string|number} identifier - The primary key value of the desired document
     * @param  {object} doc - A valid document validated against mongoose model
     * @return  {object} signature - Default methods signature format { error, data }
     * @return  {string|object} signature.error - Execution error
     * @return  {object} signature.data - Edited document
     */
    async editLocal (identifier, doc) {
      // todo
      console.log(this.#entity, this.#strategy)
    }

    /**
     * @Method DataTransportLocal.deleteLocal
     * @description deleteLocal a document from the storage
     * @param  {string|number} identifier - The primary key value of the desired document
     * @return  {object} signature - Default methods signature format { error, data }
     * @return  {string|object} signature.error - Execution error
     * @return  {object} signature.data - Deleted document
     */
    async deleteLocal (identifier) {
      // todo
      console.log(this.#entity, this.#strategy)
    }

    /**
     * @Method DataTransportLocal.findByIdLocal
     * @description find a document from the storage by ID
     * @param  {string|number} identifier - The primary key value of the desired document
     * @return  {object} signature - Default methods signature format { error, data }
     * @return  {string|object} signature.error - Execution error
     * @return  {object} signature.data - Found document
     */
    async findByIdLocal (identifier) {
      // todo
      console.log(this.#entity, this.#strategy)
    }

    /**
     * @Method DataTransportLocal.findAllLocal
     * @description find all documents
     * @return  {object} signature - Default methods signature format { error, data }
     * @return  {string|object} signature.error - Execution error
     * @return  {array} signature.data - Array of Found documents
     */
    async findAllLocal () {
      // todo
      console.log(this.#entity, this.#strategy)
    }

    /**
     * @Method DataTransportLocal.findLocal
     * @description find all documents based on the given query
     * @param  {object|null} query - The query object to search documents
     * @return  {object} signature - Default methods signature format { error, data }
     * @return  {string|object} signature.error - Execution error
     * @return  {array} signature.data - Array of Found documents
     */
    async findLocal (query) {
      // todo
      console.log(this.#entity, this.#strategy)
    }
  }

export default DataTransportLocal
