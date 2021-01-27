export async function collectionOnUpdate (eventObj) {
  // this points to React component scope
  const { data, foundation, error } = eventObj
  if (error) {
    throw new Error(`Error updating user: ${error}`)
  }
}
