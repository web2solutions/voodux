import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  /* _id: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true
  }, */
  __id: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    // required: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  vendor: {
    type: String,
    required: true,
    index: true
  },
  price_cost: {
    type: Number,
    required: true,
    default: 0,
    index: true
  }
})

schema.set('toJSON', {
  getters: true,
  virtuals: true
})

export default schema
