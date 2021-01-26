/* globals document */

// import React
import React from 'react'
import ReactDOM from 'react-dom'

// import Bootstrap
import 'bootstrap/dist/css/bootstrap.css'

// import React app
import App from './App'

// import agnostic application foundation class
import Application from './foundation/Application'

// import mongoose like data schemas
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

  /* foundation.on('application:start', async function (eventObj) {
    const { data, application, error } = eventObj
    if (error) {
      throw new Error(`Error starting application stack: ${error}`)
    }

    ReactDOM.render(
      <App application={foundation} />,
      document.getElementById('root')
    )
  }) */

  foundation.on('worker:responseClientId', onWorkerResponseClientId.bind(foundation))

  const start = await foundation.start()
  if (start.error) {
    throw new Error(`Error starting application stack: ${start.error}`)
  }

  ReactDOM.render(
    <App foundation={foundation} />,
    document.getElementById('root')
  )

  return foundation
})()
