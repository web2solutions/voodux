/* globals document */

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// application class
import Application from './Application'
import UserSchema from './schemas/User'
import ProductSchema from './schemas/Product'

// application event handlers
import onApplicationStart from './events/onApplicationStart'
import onWorkerResponseClientId from './events/onWorkerResponseClientId'

(async () => {
  const foundation = new Application({
    name: 'My App',
    useWorker: true,
    dataStrategy: 'offlineFirst',
    schemas: {
      User: UserSchema,
      Product: ProductSchema
    }

  })

  foundation.on('application:start', async function (eventObj) {
    const { /* data, application, */ error } = eventObj
    if (error) {
      throw new Error(`Error starting application stack: ${error}`)
    }

    ReactDOM.render(
      <App application={foundation} />,
      document.getElementById('root')
    )
  })

  foundation.on('worker:responseClientId', onWorkerResponseClientId.bind(foundation))

  await foundation.start()

  return foundation
})()
