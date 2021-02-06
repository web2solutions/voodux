/* global */
export default async function (eventObj) {
  const { /* data, */ foundation, error } = eventObj
  if (error) {
    throw new Error(`Error starting foundation stack: ${error}`)
  }
  const { User, Product } = foundation.data
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
}
