export async function collectionOnDelete (eventObj) {
  // this points to React component scope
  const { data, foundation, error } = eventObj
  if (error) {
    throw new Error(`Error deleting user: ${error}`)
  }
}
