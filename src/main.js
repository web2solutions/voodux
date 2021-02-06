/* globals document */

// import React
import React from 'react'
import ReactDOM from 'react-dom'

// import Bootstrap
import 'bootstrap/dist/css/bootstrap.css'

// import React app
import App from './App'

// import agnostic foundation foundation class
import Foundation from './foundation/Foundation'

// import mongoose like data schemas
import UserSchema from './schemas/User'
import ProductSchema from './schemas/Product'
import OrderSchema from './schemas/Order'
import CustomerSchema from './schemas/Customer'

// foundation event handlers
import onApplicationStart from './events/onApplicationStart'
import onWorkerResponseClientId from './events/onWorkerResponseClientId'

(async () => {
  const foundation = new Foundation({
    name: 'My App',
    useWorker: true,
    dataStrategy: 'offlineFirst',
    schemas: {
      User: UserSchema,
      Product: ProductSchema,
      Order: OrderSchema,
      Customer: CustomerSchema
    }
  })

  foundation.on('foundation:start', onApplicationStart.bind(foundation))

  foundation.on('worker:responseClientId', onWorkerResponseClientId.bind(foundation))

  const start = await foundation.start()
  if (start.error) {
    throw new Error(`Error starting foundation stack: ${start.error}`)
  }
  // console.debug('start', start)
  ReactDOM.render(
    <App foundation={foundation} />,
    document.getElementById('root')
  )

  return foundation
})()
