import VooduXWorker from './VooduXWorker'
import { createMethodSignature, ArrayObserver } from './utils'

export default class DataJobManager {
  #_queue
  #_resolvers
  #_schemas
  constructor() {
    this.#_queue = []
    this.#_resolvers = {}
    this.#_schemas = {}
    this.vooduxWebWorker = null
    let ao = new ArrayObserver(this.#_queue)
    ao.Observe((request, method) => {
      if (method === 'push') {
        console.info('>> new job queued', request)
        const jobAction = request.job.action
        switch (jobAction) {
          case 'add':
            this.addData(request)
            break
          default:
            console.log('no action')
        }
      }
    })
  }
  workerMessageHandler (e) {
    const response = e.data
    const { cmd, data, job } = response
    switch (cmd) {
      case 'job':
        this.notifyActors(response)
        break
      default:
      // console.log('DataJobManagerdont know what to do ', e.data)
    }
  }
  notifyActors (response) {
    const { cmd, data, job } = response
    console.log('Job executed on worker: ', job)
    console.log('Job result from worker: ', data)
    if (this.#_resolvers[job.correlationId]) {
      const resolver = this.#_resolvers[job.correlationId]
      // call resolver and notify actors
      resolver(createMethodSignature(null, data))
      //  delete this resolver from queue
      delete this.#_resolvers[job.correlationId]
      for (let x = 0; x < this.#_queue.length; x++) {
        const request = this.#_queue[x]
        if (request.job.correlationId === job.correlationId) {
          // delete request from queue
          this.#_queue.splice(x, 1)
        }
      }
    }
  }
  mapSchemas(schemas) {
    console.warn('>>>>>------- mapSchemas', schemas)
    this.#_schemas = {...schemas}
  }
  start() {
    console.warn('>>>>>------- start DataJobManager')
    this.vooduxWebWorker = new VooduXWorker()
    this.vooduxWebWorker.start()
    this.vooduxWebWorker.addEventListener(
      'message',
      this.workerMessageHandler.bind(this),
      false
    )
    this.vooduxWebWorker.setSchemas({
      schemas: this.#_schemas
    })
    this.vooduxWebWorker.startLocalTransport()
  }
  addData (request) {
    // add to local database
    // if is there an error, error will become an array or errors
    if (!this.vooduxWebWorker.started) {
      console.error('>>>>>>>>>>>> WORKER IS NOT STARTED <<<<<<<<<<<<')
    }
    
    console.log('addData', request)

    // send request to voodux
    this.vooduxWebWorker.request(request.job)

    // lets save our resolver to call when receive the job execution result
    const { correlationId } = request.job
    this.#_resolvers[correlationId] = request.resolver
  }

  enqueueJob (job, resolver) {
    const request = {
      job,
      resolver
    }
    this.#_queue.push(request)
  }

  unqueue (job) {
    this.#_queue.push(job)
  }
  runJob (obj) {
    const job = { ...obj }
  }
}
