// application class
import Application from './Application'

import UserSchema from './schemas/User'

// application event handlers
import onApplicationStart from './events/onApplicationStart'
import onWorkerResponseClientId from './events/onWorkerResponseClientId'

(async () => {
  const _myApp = new Application({
    name: 'My App',
    useWorker: true,
    dataStrategy: 'offlineFirst',
    schemas: {
      User: UserSchema
    }

  })

  _myApp.on('application:start', onApplicationStart.bind(_myApp))

  _myApp.on('worker:responseClientId', onWorkerResponseClientId.bind(_myApp))

  await _myApp.start()

  return _myApp
})()
