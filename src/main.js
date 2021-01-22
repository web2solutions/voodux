// application class
import Application from './Application'

import UserSchema from './schemas/User'

// application event handlers
import onApplicationStart from './events/onApplicationStart'
import onWorkerResponseClientId from './events/onWorkerResponseClientId'

(async () => {
  const foundation = new Application({
    name: 'My App',
    useWorker: true,
    dataStrategy: 'offlineFirst',
    schemas: {
      User: UserSchema
    }

  })

  foundation.on('application:start', onApplicationStart.bind(foundation))

  foundation.on('worker:responseClientId', onWorkerResponseClientId.bind(foundation))

  await foundation.start()

  return foundation
})()
