export async function collectionOnUpdate (eventObj) {
  // this points to React component scope
  console.error('............. collectionOnUpdate')
  const { data, primaryKey, document, foundation, error } = eventObj
  if (error) {
    throw new Error(`Error updating user: ${error}`)
  }
  console.log(this.state.users)
  const newData = this.state.users.map((user) => {
    if (user.__id === primaryKey) {
      return data
    } else {
      return user
    }
  })

  // manage state by setting users avoiding race conditions
  // setOrders([...newData])

  this.setState(prevState => ({
    users: [...newData]
  }))
}
