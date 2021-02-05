/* globals document */
import React from 'react'
import { Redirect, useParams } from 'react-router-dom'
// import { LinkContainer } from 'react-router-bootstrap'
// import swal from 'sweetalert'
// import moment from 'moment'
import swal from 'sweetalert'

/* const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}) */

const customerObj = {
  __id: null,
  _id: null,
  name: '',
  address: 'Seminole, FL',
  email: '',
  cards: []
}

class CustomersEdit extends React.Component {
  #__id
  constructor (props) {
    super(props)
    this.entity = 'Customer'
    this.foundation = props.foundation
    this.pagination = {
      offset: 0,
      limit: 30
    }
    this.state = {
      customer: {
        ...customerObj
      },
      cards: ['VISA ⠀*** 3719'],
      toDashboard: false
    }
    this.#__id = null
    this.form = null
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleChangeFieldValue = this.handleChangeFieldValue.bind(this)
    console.debug('constructor')
  }

  async componentDidMount () {
    console.debug('componentDidMount', this.props)
    const { match: { params } } = this.props
    const { Customer } = this.foundation.data

    if (!this.state.toDashboard) {
      this.form = document.querySelectorAll('.needs-validation')[0]
      this.form.addEventListener('submit', this.handleFormSubmit, false)
    }
    console.log(params)
    const { __id } = params
    this.#__id = __id
    const findCustomer = await Customer.findById(this.#__id)
    console.error('findCustomer', findCustomer)
    if (findCustomer.error) {
      console.error('findCustomer.error', findCustomer.error)
      return
    }
    if (findCustomer.data) {
      this.setState({ customer: findCustomer.data })
      // setCustomer(findCustomer.data)
    }
  }

  handleChangeFieldValue (e) {
    // e.preventDefault()
    const newHash = { ...this.state.customer }
    const name = e.target.id || e.target.name
    const value = e.target.value
    newHash[name] = value
    if (name === 'cards') {
      if (value !== '') {
        newHash[name] = [value]
      } else {
        newHash[name] = []
      }
    }
    // console.error('newHash', newHash)
    this.setState({ customer: newHash })
  }

  async handleFormSubmit (e) {
    const { Customer } = this.foundation.data
    if (!this.form.checkValidity()) {
      // console.log('not validated')
    }
    e.preventDefault()
    e.stopPropagation()
    this.form.classList.add('was-validated')
    // console.error('this.state.customer', this.state.customer)

    const doc = { ...this.state.customer }

    const { data, error } = await Customer.edit(this.#__id, doc)
    console.error('data', data)
    if (error) {
      swal('Database error', error.message, 'error')
      return
    }
    this.setState({ toDashboard: true })
  }

  render () {
    console.debug('render')
    console.debug('this.state.toDashboard', this.state.toDashboard)
    if (this.state.toDashboard === true) {
      return <Redirect to='/Customers' />
    }
    return (
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4 main'>
        <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 bcustomer-bottom'>
          <h1 className='h2'>Customer Edit - {this.state.customer.name}</h1>
        </div>
        <div className='table-responsive'>
          <form className='needs-validation' noValidate>
            <div className='row g-3'>
              <div className='col-12'>
                <label htmlFor='name' className='form-label'>Name</label>
                <input type='text' className='form-control' id='name' placeholder='' value={this.state.customer.name} required onChange={this.handleChangeFieldValue}/>
                <div className='invalid-feedback'>
                  Valid first name is required.
                </div>
              </div>
              <div className='col-12'>
                <label htmlFor='email' className='form-label'>Email </label>
                <input type='email' className='form-control' id='email' placeholder='you@example.com' required value={this.state.customer.email} onChange={this.handleChangeFieldValue} />
                <div className='invalid-feedback'>
                  Please enter a valid email address for shipping updates.
                </div>
              </div>

              <div className='col-12'>
                <label htmlFor='address' className='form-label'>Address</label>
                <input type='text' className='form-control' id='address' placeholder='1234 Main St' required value={this.state.customer.address} onChange={this.handleChangeFieldValue} />
                <div className='invalid-feedback'>
                  Please enter your shipping address.
                </div>
              </div>

              <div className='col-md-5'>
                <label htmlFor='cards' className='form-label'>Payment method</label>
                <select
                  className='custom-select'
                  id='cards'
                  required
                  multiple
                  onChange={this.handleChangeFieldValue}
                  value={this.state.customer.cards}
                >
                  <option value=''>Choose...</option>
                  {this.state.cards.map((card) => (
                    <option key={card} value={card}>{card}</option>
                  ))}
                </select>
                <div className='invalid-feedback'>
                  Please select a valid credit card.
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

export default CustomersEdit
