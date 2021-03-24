export default class VooduXWorker {
  #_worker
  #_started
  constructor () {
    this.#_worker = null
    this.#_started = false
    console.warn('>>>>>------- VooduXWorker is created')
  }
  messageHandler (e) {
    const response = e.data
    const { cmd, data } = response
    if (cmd === 'start') {
      if (data) {
        this.#_started = true
        console.warn('VooduXWorker is started <<<<<<<<<<<<<<<', this.#_started)
      }
    }
  }
  addEventListener (name, fn) {
    this.#_worker.addEventListener(name, fn, false)
  }
  get started() {
    return this.#_started
  }
  start() {
    console.warn('>>>>>------- VooduXWorker is starting')
    const self = this
    this.#_worker = new Worker('VooduXWebWorker.js')
    this.#_worker.addEventListener(
      'message',
      this.messageHandler.bind(self),
      false
    )
    this.#_worker.postMessage({ cmd: 'start' })
  }
  stop () {
    this.#_worker.postMessage({ cmd: 'stop' })
  }
  request (job) {
    this.#_worker.postMessage({ cmd: 'job', job })
  }
  setSchemas({ schemas }) {
    console.log(schemas)
    let rawSchemas = {}
    for (let [key, value] of Object.entries(schemas)) {
      console.log(value.obj)
      if (value.obj.name) {
        console.warn(value.obj.name.type.name)
      }
      rawSchemas[key] = value.obj
    }
    rawSchemas = JSON.parse(JSON.stringify(rawSchemas))
    console.log(rawSchemas)
    this.#_worker.postMessage({ cmd: 'setSchemas', schemas })
  }
  startLocalTransport() {
    this.#_worker.postMessage({ cmd: 'startLocalTransport' })
  }
}
