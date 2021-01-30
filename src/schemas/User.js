import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  /* _id: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true
  },
  __id: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true
  }, */
  name: {
    type: String,
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    index: true
  }
})

schema.set('toJSON', {
  getters: true,
  virtuals: true
})

export default schema
