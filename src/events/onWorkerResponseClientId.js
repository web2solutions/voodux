/* global document */
export default function (eventObj) {
  console.error('worker:responseClientId::::::::', eventObj)
  const { /* application, worker, cmd, */ message } = eventObj
  document.getElementById('worker_guid').innerText = 'Worker GUID -> ' + message
}
