/* const workerOnMessage = function (event) {
  // console.error('_workerOnMessage')
  const { cmd , message } = event.data
  switch (cmd) {
    case 'responseClientId':
      this.triggerEvent('worker:responseClientId', {
        foundation: this,
        worker: this.applicationWorker,
        ...event.data
      })
      break
    default:
      console.log(`Sorry, we are out of ${cmd}.`)
  }
}

export default workerOnMessage */
