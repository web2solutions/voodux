/* global document */
export default async function (eventObj) {
  const { /* data, */ application, error } = eventObj
  if (error) {
    throw new Error(`Error starting application stack: ${error}`)
  }
  const { User, Product } = application.data
  const Eduardo = await User.add({
    name: 'Eduardo Almeida',
    username: 'web2'
  })
  console.debug('Eduardo', Eduardo)

  const Volvo = await Product.add({
    name: 'Volvo XC90',
    vendor: 'Volvo',
    price_cost: 150000
  })
  console.debug('Volvo', Volvo)

  // console.log('application.applicationWorker', application.applicationWorker)

  document.getElementById('guid').innerText = 'Aplication GUID -> ' + this.guid

  const dialog = document.getElementById('favDialog')
  dialog.returnValue = 'favAnimal'
  dialog.showModal()
}
