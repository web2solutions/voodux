let _entity = ''
let _strategy = ''
let _model = {}
/**
 * @Class DataAPI
 */
export default class DataAPI {
  /**
   * @Constructor DataAPI
   * @param  {object} config options: entity, strategy, model
   */
  constructor ({ entity, strategy, model } = {}) {
    _entity = entity
    _strategy = strategy // offlineFirst, onlineFirst, offline, online
    _model = model
  }

  get entity () {
    return _entity
  }

  get model () {
    return _model
  }

  get strategy () {
    return _strategy
  }

  async add () {
    // xxxx
    console.log(_entity, _strategy)
  }

  async edit () {
    // todo
    console.log(_entity, _strategy)
  }

  async delete () {
    // todo
    console.log(_entity, _strategy)
  }

  async findById () {
    // todo
    console.log(_entity, _strategy)
  }

  async findAll () {
    // todo
    console.log(_entity, _strategy)
  }

  async find () {
    // todo
    console.log(_entity, _strategy)
  }
}

/* function ModelAPI ({ entity, strategy } = {}) {
  return {
    add: () => {

    },
    edit: () => {

    },
    delete: () => {

    },
    find: () => {

    }
  }
} */
