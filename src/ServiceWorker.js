/* global self */

self.addEventListener('install', function (event) {
  /* event.waitUntil(
    (async function () {
      console.error('FROM WORKER -> 1 - install event---->>>>>>', event)
      console.error('FROM WORKER -> 1 - install event.currentTarget---->>>>>>', event.currentTarget)
    })()
  ) */
})

self.addEventListener('activate', function (event) {
  /* event.waitUntil(
    (async function () {
      console.error('FROM WORKER -> 2 - worker activated ---->>>>>>', event)
      console.log('FROM WORKER -> self', self)

      self.clients.claim()
      const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
      console.error('FROM WORKER -> 2 - active event.target ---->>>>>>', event.target)

      clients.forEach((client) => {
        console.warn(' CRIENT =======>', client)
        // client.postMessage({ cmd: 'responseBroadcast', message })
      })

      // console.log('clients', xxxx)
      // console.log('client', self.Client)
      // self.serviceWorker.postMessage({
      //   msg: 'Worker sent a message sayin activated!'
      // })
    })()
  ) */
})

self.addEventListener('fetch', (event) => {
  console.error('fecth tech', event.clientId)
})

self.addEventListener('message', function (event) {
  console.error('FROM WORKER -> SERVICE WORKER RECEIVED MESSAGE', event.source)
  // console.debug(event)
  // event.currentTarget.WindowClient.postMessage('Hi client2')
  // event.source.postMessage('Hi client')
  const sender = event.source
  const { cmd, message } = event.data
  switch (cmd) {
    case 'getClientId':
      console.warn(' sending responseClientId =======>', sender)
      sender.postMessage({ cmd: 'responseClientId', message: sender.id })
      break
    case 'broadcast':
      self.clients.claim()
      self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          console.warn(' broadcasting to client =======>', client)
          client.postMessage({ cmd: 'responseBroadcast', message })
        })
      })
      break
    default:
      console.log(`Sorry, we are out of ${cmd}.`)
  }
  // console.error('><><><><><><><><<><><>', self.Client().id)
})
