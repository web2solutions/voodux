/* global self caches fetch */

// self.importScripts('https://unpkg.com/idb/build/iife/index-min.js')

const CACHE_NAME = 'V1'
const STATIC_CACHE_URLS = ['/', 'main.js']

self.addEventListener('install', (event) => {
  // console.log('Service Worker installing.')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_CACHE_URLS))
  )
})


self.addEventListener('activate', function (event) {
  /* event.waitUntil(
    (async function () {
      // console.error('FROM WORKER -> 2 - worker activated ---->>>>>>', event)
      // console.log('FROM WORKER -> self', self)

      self.clients.claim()
      const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
      // console.error('FROM WORKER -> 2 - active event.target ---->>>>>>', event.target)

      clients.forEach((client) => {
        // console.warn(' CRIENT =======>', client)
        // client.postMessage({ cmd: 'responseBroadcast', message })
      })

      // // console.log('clients', xxxx)
      // // console.log('client', self.Client)
      // self.serviceWorker.postMessage({
      //   msg: 'Worker sent a message sayin activated!'
      // })
    })()
  ) */
})

self.addEventListener('fetch', (event) => {
  // console.log(`Request of ${event.request.url}`)

  // default behaviour: request the network
  // event.respondWith(fetch(event.request))
  // Cache-First Strategy
  event.respondWith(
    caches
      .match(event.request) // check if the request has already been cached
      .then((cached) => cached || fetch(event.request)) // otherwise request network
  )
})

self.addEventListener('message', function (event) {
  // console.error('FROM WORKER -> SERVICE WORKER RECEIVED MESSAGE', event.source)
  // // console.debug(event)
  // event.currentTarget.WindowClient.postMessage('Hi client2')
  // event.source.postMessage('Hi client')
  const sender = event.source
  const { cmd, message } = event.data
  switch (cmd) {
    case 'getClientId':
      // console.warn(' sending responseClientId =======>', sender)
      sender.postMessage({ cmd: 'responseClientId', message: sender.id })
      break
    case 'broadcast':
      self.clients.claim()
      self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          // console.warn(' broadcasting to client =======>', client)
          client.postMessage({ cmd: 'responseBroadcast', message })
        })
      })
      break
    default:
      // console.log(`Sorry, we are out of ${cmd}.`)
  }
  // // console.error('><><><><><><><><<><><>', self.Client().id)
})
