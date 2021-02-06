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

const customerObj = {
  name: '',
  address: 'Seminole, FL',
  email: '',
  cards: []
}
/**
 * @author Eduardo Perotta de Almeida <web2solucoes@gmail.com>
 * @Component CustomersAdd
 * @description React component that creates new a Customer into the database
 * @extends React.Component
 */
class CustomersAdd extends React.Component {
  constructor (props) {
    super(props)
    /**
     * Entity name which this component represents to
     */
    this.entity = 'Customer'
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
      customer: {
        ...customerObj
      },
      cards: ['VISA ⠀*** 3719'],
      toDashboard: false
    }
    this.form = null
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleChangeFieldValue = this.handleChangeFieldValue.bind(this)
  }

  async componentDidMount () {
    if (!this.state.toDashboard) {
      this.form = document.querySelectorAll('.needs-validation')[0]
      this.form.addEventListener('submit', this.handleFormSubmit, false)
    }
  }

  /**
   * @Method CustomersAdd.handleChangeFieldValue
   * @summary Event handler that change form field values and set it state
   * @param  {event} event - The HTML event triggered on User interation
   * @example
handleChangeFieldValue(e) {
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
  this.setState({ customer: newHash })
}
   */
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

  /**
   * @async
   * @Method CustomersAdd.handleFormSubmit
   * @summary Event handler that handles the form submission
   * @param  {event} event - The HTML event triggered on User interation
   * @example
async handleFormSubmit(e) {
  const { Customer } = this.foundation.data
  if (!this.form.checkValidity()) {
    // console.log('not validated')
  }
  e.preventDefault()
  e.stopPropagation()
  this.form.classList.add('was-validated')
  const doc = { ...this.state.customer }
  const { data, error } = await Customer.add(doc)
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
    const { Customer } = this.foundation.data
    if (!this.form.checkValidity()) {
      // console.log('not validated')
    }
    this.form.classList.add('was-validated')
    const doc = { ...this.state.customer }
    const { /* data, */ error } = await Customer.add(doc)
    if (error) {
      swal('Database error', error.message, 'error')
      return
    }
    this.setState({ toDashboard: true })
  }

  /**
   * @async
   * @Method CustomersAdd.render
   * @summary Component render function.
   * @description Renders a form to create the Customer data
   */
  render () {
    if (this.state.toDashboard === true) {
      return <Redirect to='/Customers' />
    }
    return (
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4 main'>
        <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 bcustomer-bottom'>
          <h1 className='h2'>Customer Add</h1>
        </div>
        <div className='table-responsive'>
          <form className='needs-validation' noValidate>
            <div className='row g-3'>
              <div className='col-12'>
                <label htmlFor='name' className='form-label'>Name</label>
                <input
                  type='text'
                  className='form-control'
                  id='name'
                  placeholder=''
                  value={this.state.customer.name}
                  required
                  onChange={this.handleChangeFieldValue}
                />
                <div className='invalid-feedback'>
                  Valid name is required.
                </div>
              </div>
              <div className='col-12'>
                <label htmlFor='email' className='form-label'>Email </label>
                <input
                  type='email'
                  className='form-control'
                  id='email'
                  placeholder='you@example.com'
                  required
                  value={this.state.customer.email}
                  onChange={this.handleChangeFieldValue}
                />
                <div className='invalid-feedback'>
                  Please enter a valid email address for shipping updates.
                </div>
              </div>

              <div className='col-12'>
                <label htmlFor='address' className='form-label'>Address</label>
                <input
                  type='text'
                  className='form-control'
                  id='address'
                  placeholder='1234 Main St'
                  required
                  value={this.state.customer.address}
                  onChange={this.handleChangeFieldValue}
                />
                <div className='invalid-feedback'>
                  Please enter your address.
                </div>
              </div>

              <div className='col-md-5'>
                <label htmlFor='cards' className='form-label'>Credit cards</label>
                <select
                  className='custom-select'
                  id='cards'
                  required
                  onChange={this.handleChangeFieldValue}
                >
                  <option value=''>Choose...</option>
                  {this.state.cards.map((card) => (
                    <option
                      key={card}
                      value={card}
                    >
                      {card}
                    </option>
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

export default CustomersAdd
