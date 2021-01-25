onconnect = function (e) {
  console.error(e)
  const ee = e
  var port = e.ports[0]
  port.onmessage = function (e) {
    console.error('SHARED WORKER RECEIVED MESSAGE', e)
    var workerResult = 'Result: ' + (e.data[0] * e.data[1])
    port.postMessage(workerResult)
  }
}
