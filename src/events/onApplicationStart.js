/* global document */
export default async function (eventObj) {
  console.error('application:start::::::::', eventObj)
  const { /* data, */ application, error } = eventObj
  for (const [key, value] of this.models) {
    console.log(key)
    console.log(value)
  }

  if (error) {
    throw new Error(`Error starting application stack: ${error}`)
  }

  console.log(application)
  console.log(application.models)
  console.log(application.models.get('User'))
  const userCollection = application.models.get('User')
  console.log(userCollection)
  await userCollection.add()

  console.log('application.applicationWorker', application.applicationWorker)

  document.getElementById('guid').innerText = 'Aplication GUID -> ' + this.guid

  const dialog = document.getElementById('favDialog')
  dialog.returnValue = 'favAnimal'
  dialog.showModal()
}
