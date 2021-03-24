



// import dexie from 'dexie'
import LocalDatabaseTransport from './LocalDatabaseTransport'
import { genDbName } from './utils'
import schemas from './_schemas'

// let schemas = {} // {entity, schema}

let localDatabaseTransport = null
const startLocalTransport = async () => {
  localDatabaseTransport = new LocalDatabaseTransport({
    dbName: genDbName('WorkerDB')
  })
  console.log('>>>>>> schemas', schemas)
  for (let [entity, schema] of Object.entries(schemas)) {
    console.log(entity, schema)
    localDatabaseTransport.addSchema(entity, schema)
  }
  
  const connection = await localDatabaseTransport.connect()
  console.warn('tables tables', localDatabaseTransport.tables)
  console.warn('connection', connection)
}

const startWorker = (request) => {
  self.postMessage({ cmd: 'start', data: true, error: null })
  // const connection = await localDatabaseTransport.connect()
}

const executeJob = (request) => {
  let error = null
  console.warn('WORKER>>>>>>>>> executeJob request', request)
  const job = request.job
  const data = { __id: 1, ...request.job.payload }
  // now that job is executed, lets inform main thread
  self.postMessage({ cmd: 'job', job, data, error })
}

const setSchemas = (request) => {
  console.warn('WORKER>>>>>>>>> setSchemas request', request)
  /* const receivedSchemas = { ...request.schemas }
  const entities = Object.keys(receivedSchemas)
  entities.forEach(entity => {
    const schema = receivedSchemas[entity]
    schemas.push({
      entity,
      schema
    })
  }) */
  console.log('schemas', schemas)
}

const messagehandler = (e) => {
  const request = e.data;
  switch (request.cmd) {
    case 'start':
      startWorker(request)
      break;
    case 'setSchemas':
      setSchemas(request)
      break;
    case 'startLocalTransport':
      startLocalTransport(request)
      break;
    case 'job':
      executeJob(request)
      break;
    case 'stop':
      self.postMessage('WORKER STOPPED');
      self.close(); // Terminates the worker.
      break;
    default:
      // self.postMessage('Unknown command: ' + data.msg);
  }
}

self.addEventListener('message', messagehandler, false);
