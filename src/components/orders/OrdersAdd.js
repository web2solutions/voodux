/* globals document */
import React from 'react'
import { Redirect } from 'react-router-dom'
// import { LinkContainer } from 'react-router-bootstrap'
// import swal from 'sweetalert'
// import moment from 'moment'
import swal from 'sweetalert'

/* const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}) */

const orderObj = {
  name: '',
  shipTo: '',
  paymentMethod: '',
  amount: '',
  customerId: ''
}
/**
 * @author Eduardo Perotta de Almeida <web2solucoes@gmail.com>
 * @Component OrdersAdd
 * @description React component that creates new a Order into the database
 * @extends React.Component
 */
class OrdersAdd extends React.Component {
  constructor (props) {
    super(props)
    /**
     * Entity name which this component represents to
     */
    this.entity = 'Order'
    /**
     * access to foundation instance
     */
    this.foundation = props.foundation
    /**
     * default pagination to list data
     */
    this.pagination = {
      offset: 0,
      limit: 30
    }
    /**
     * component state
     */
    this.state = {
      order: {
        ...orderObj
      },
      customers: [],
      toDashboard: false
    }
    this.form = null
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleChangeFieldValue = this.handleChangeFieldValue.bind(this)
  }

  /**
   * @Method OrdersAdd.componentDidMount
   * @summary Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * @description Once component is monted we are now ready to get customer list to use on select html item.
   * We could also listen to changes in Customer and change the select values based on those events
   * @example
async componentDidMount() {
  const { Customer } = this.foundation.data
  if (!this.state.toDashboard) {
    this.form = document.querySelectorAll('.needs-validation')[0]
    this.form.addEventListener('submit', this.handleFormSubmit, false)
  }
  const findCustomers = await Customer.find({})
  if (!findCustomers) {
    return
  }
  if (findCustomers.data) {
    this.setState({
      customers: findCustomers.data
    })
  }
}
   */

  async componentDidMount () {
    const { Customer } = this.foundation.data
    if (!this.state.toDashboard) {
      this.form = document.querySelectorAll('.needs-validation')[0]
      this.form.addEventListener('submit', this.handleFormSubmit, false)
    }
    const findCustomers = await Customer.find({})
    if (!findCustomers) {
      return
    }
    if (findCustomers.data) {
      this.setState({ customers: findCustomers.data })
    }
  }

  /**
   * @Method OrdersAdd.handleChangeFieldValue
   * @summary Event handler that change form field values and set it state
   * @param  {event} event - The HTML event triggered on User interation
   * @example
handleChangeFieldValue(e) {
  const { Customer } = this.foundation.data

  if (e.target) {
    if (e.target.value === null || e.target.value === 'null') {
      const copy = { ...orderObj }
      delete copy.amount
      // console.debug(copy)
      this.setState({ order: copy })
      return
    }
  }
  const newHash = { ...this.state.order }
  if (e.target.id === 'amount') {
    newHash[e.target.id] = e.target.value
  } else if (e.target.id === 'name') {
    const { data, error } = await Customer.findById(e.target.value)
    if (error) {
      return
    }
    // console.error({ data, error })
    newHash.customerId = data.__id
    newHash.name = data.name
    newHash.shipTo = data.address
    newHash.paymentMethod = data.cards[0]
  }

  // console.error(newHash)
  this.setState({ order: newHash })
}
   */
  async handleChangeFieldValue (e) {
    const { Customer } = this.foundation.data

    if (e.target) {
      if (e.target.value === null || e.target.value === 'null') {
        const copy = { ...orderObj }
        delete copy.amount
        // console.debug(copy)
        this.setState({ order: copy })
        return
      }
    }
    const newHash = { ...this.state.order }
    if (e.target.id === 'amount') {
      newHash[e.target.id] = e.target.value
    } else if (e.target.id === 'name') {
      const { data, error } = await Customer.findById(e.target.value)
      if (error) {
        return
      }
      // console.error({ data, error })
      newHash.customerId = data.__id
      newHash.name = data.name
      newHash.shipTo = data.address
      newHash.paymentMethod = data.cards[0]
    }

    // console.error(newHash)
    this.setState({ order: newHash })
  }

  /**
   * @async
   * @Method OrdersAdd.handleFormSubmit
   * @summary Event handler that handles the form submission
   * @param  {event} event - The HTML event triggered on User interation
   * @example
async handleFormSubmit(e) {
  const { Order } = this.foundation.data
  if (!this.form.checkValidity()) {
    // console.log('not validated')
  }
  e.preventDefault()
  e.stopPropagation()
  this.form.classList.add('was-validated')
  const doc = { ...this.state.order }
  const { data, error } = await Order.add(doc)
  if (error) {
    swal('Database error', error.message, 'error')
    return
  }
  this.setState({ toDashboard: true })
}
   */
  async handleFormSubmit (e) {
    e.preventDefault()
    e.stopPropagation()
    const { Order } = this.foundation.data
    if (!this.form.checkValidity()) {
      // console.log('not validated')
    }
    this.form.classList.add('was-validated')
    const doc = { ...this.state.order }
    const { /* data, */ error } = await Order.add(doc)
    if (error) {
      swal('Database error', error.message, 'error')
      return
    }
    this.setState({ toDashboard: true })
  }

  /**
   * @async
   * @Method OrdersAdd.render
   * @summary Component render function.
   * @description Renders a form to create the Order data
   */
  render () {
    if (this.state.toDashboard === true) {
      return <Redirect to='/Orders' />
    }
    return (
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4 main'>
        <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
          <h1 className='h2'>Order Add</h1>
        </div>
        <div className='table-responsive'>
          <form className='needs-validation' noValidate>
            <div className='row g-3'>
              <div className='col-md-5'>
                <label htmlFor='name' className='form-label'>Customer</label>
                <select
                  className='custom-select'
                  id='name'
                  required
                  value={this.state.order.customerId}
                  onChange={this.handleChangeFieldValue}
                >
                  <option value=''>Choose...</option>
                  {this.state.customers.map((customer) => (
                    <option
                      key={customer.__id}
                      value={customer.__id}
                    >
                      {customer.name}
                    </option>
                  ))}
                </select>
                <div className='invalid-feedback'>
                  Please select a Customer.
                </div>
              </div>
              <div className='col-12'>
                <label htmlFor='amount' className='form-label'>Amount</label>
                <input
                  type='text'
                  className='form-control'
                  id='amount'
                  placeholder=''
                  value={this.state.order.amount}
                  required
                  onChange={this.handleChangeFieldValue}
                />
                <div className='invalid-feedback'>
                  Valid amount
                </div>
              </div>
            </div>

            <hr className='my-4' />

            <button className='w-100 btn btn-primary btn-lg' type='submit'>save</button>
          </form>
        </div>
      </main>

    )
  }
}

export default OrdersAdd
