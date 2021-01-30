import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  /* _id: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true
  },
  __id: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    // required: true
  }, */
  name: {
    type: String,
    required: true,
    index: true
  },
  shipTo: {
    type: String,
    required: true,
    index: true
  },
  paymentMethod: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
    index: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
})

schema.set('toJSON', {
  getters: true,
  virtuals: true
})

export default schema
