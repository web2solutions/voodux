import Foundation from './Foundation'

const CustomerSchema = new Foundation.Schema({
  name: {
      type: String,
      required: true,
      index: true
  },
  address: {
      type: String,
      required: true,
      index: true
  },
  email: {
      type: String,
      required: true,
      index: true
  },
  cards: {
      type: [],
      required: true
  }
})

const OrderSchema = new Foundation.Schema({
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

const ProductSchema = new Foundation.Schema({
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

const UserSchema = new Foundation.Schema({
  name: {
      type: String,
      required: true
  },
  username: {
      type: String,
      required: true
  }
})

export default {
  User: UserSchema,
  Product: ProductSchema,
  Order: OrderSchema,
  Customer: CustomerSchema
}
