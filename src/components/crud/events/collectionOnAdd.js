
export async function collectionOnAdd (eventObj) {
  // this points to React component scope
  console.error('............. collectionOnAdd')
  const { foundation, error, document, data } = eventObj
  if (error) {
    throw new Error(`Error adding user: ${error}`)
  }
  // manage state by setting users avoiding race conditions
  this.setState(prevState => ({
    users: [data, ...prevState.users]
  }))
}
