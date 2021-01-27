export async function collectionOnAdd (eventObj) {
  // this points to React component scope
  const { foundation, error, document, data } = eventObj
  if (error) {
    throw new Error(`Error adding user: ${error}`)
  }
  // const users = [...this.state.users].unshift(data)
  // this.setState({ users })

  this.setState(prevState => ({
    users: [data, ...prevState.myArray]
  }))
}
