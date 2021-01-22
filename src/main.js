// application class
import Application from './Application'

// application event handlers
import onApplicationStart from './events/onApplicationStart'
import onWorkerResponseClientId from './events/onWorkerResponseClientId'

(async () => {
  const _myApp = new Application({
    name: 'My App',
    useWorker: true,
    dataStrategy: 'offlineFirst'
  })

  _myApp.on('application:start', onApplicationStart.bind(_myApp))

  _myApp.on('worker:responseClientId', onWorkerResponseClientId.bind(_myApp))

  const isStarted = await _myApp.start()
  console.log('isStarted', isStarted)
  console.log(_myApp)
  return _myApp
})()
