/* global document */
export default function (eventObj) {
  console.error('application:start::::::::', eventObj)
  const { /* application, data, */ error } = eventObj
  for (const [key, value] of this.models) {
    console.log(key)
    console.log(value)
  }

  if (error) {
    throw new Error(`Error starting application stack: ${error}`)
  }

  document.getElementById('guid').innerText = 'Aplication GUID -> ' + this.guid

  const dialog = document.getElementById('favDialog')
  dialog.returnValue = 'favAnimal'
  dialog.showModal()
}
