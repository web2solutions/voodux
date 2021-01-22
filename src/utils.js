export const createMethodSignature = (error = null, data = null) => {
  return { error, data }
}

const S4 = () => {
  return Math.floor(Math.random() * 0x10000 /* 65536 */).toString(16)
}

export const GUID = () => {
  return (
    S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
  )
}

export function uuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
