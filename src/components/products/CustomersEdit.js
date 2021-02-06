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

const productObj = {
  __id: null,
  _id: null,
  name: '',
  address: 'Seminole, FL',
  email: '',
  cards: []
}
/**
 * @author Eduardo Perotta de Almeida <web2solucoes@gmail.com>
 * @Component ProductsEdit
 * @description React component that edits a Product data by biding it to a form
 * @extends React.Component
 */
class ProductsEdit extends React.Component {
  #__id
  constructor (props) {
    super(props)
    /**
     * Entity name which this component represents to
     */
    this.entity = 'Product'
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
      product: {
        ...productObj
      },
      cards: ['VISA ⠀*** 3719'],
      toDashboard: false
    }
    this.#__id = null
    this.form = null
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleChangeFieldValue = this.handleChangeFieldValue.bind(this)
  }
  /**
   * @async
   * @Method ProductsEdit.componentDidMount
   * @summary Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * @description Once component is monted we are now ready to get the desired Product data in database and bind to state.product
   * @example
  async componentDidMount() {
    if (!this.state.toDashboard) {
      this.form = document.querySelectorAll('.needs-validation')[0]
      this.form.addEventListener('submit', this.handleFormSubmit, false)
    }
    const { match: { params } } = this.props
    const { Product } = this.foundation.data
    const { __id } = params
    this.#__id = __id
    const findProduct = await Product.findById(this.#__id)
    if (findProduct.error) {
      console.error('findProduct.error', findProduct.error)
      return
    }
    if (findProduct.data) {
      this.setState({
        product: findProduct.data
      })
    }
  }
   */
  async componentDidMount() {
    if (!this.state.toDashboard) {
      this.form = document.querySelectorAll('.needs-validation')[0]
      this.form.addEventListener('submit', this.handleFormSubmit, false)
    }
    const { match: { params } } = this.props
    const { Product } = this.foundation.data
    const { __id } = params
    this.#__id = __id
    const findProduct = await Product.findById(this.#__id)
    if (findProduct.error) {
      console.error('findProduct.error', findProduct.error)
      return
    }
    if (findProduct.data) {
      this.setState({ product: findProduct.data })
    }
  }

  /**
   * @Method ProductsEdit.handleChangeFieldValue
   * @summary Event handler that change form field values and set it state
   * @param  {event} event - The HTML event triggered on User interation
   * @example
handleChangeFieldValue(e) {
  const newHash = { ...this.state.product }
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
  this.setState({ product: newHash })
}
   */
  handleChangeFieldValue (e) {
    const newHash = { ...this.state.product }
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
    this.setState({ product: newHash })
  }

  /**
   * @async
   * @Method ProductsEdit.handleFormSubmit
   * @summary Event handler that handles the form submission
   * @param  {event} event - The HTML event triggered on User interation
   * @example
async handleFormSubmit(e) {
  const { Product } = this.foundation.data
  if (!this.form.checkValidity()) {
    // console.log('not validated')
  }
  e.preventDefault()
  e.stopPropagation()
  this.form.classList.add('was-validated')
  const doc = { ...this.state.product }
  const { data, error } = await Product.edit(this.#__id, doc)
  if (error) {
    swal('Database error', error.message, 'error')
    return
  }
  this.setState({ toDashboard: true })
}
   */
  async handleFormSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    const { Product } = this.foundation.data
    if (!this.form.checkValidity()) {
      // console.log('not validated')
    }
    this.form.classList.add('was-validated')
    const doc = { ...this.state.product }
    const { data, error } = await Product.edit(this.#__id, doc)
    if (error) {
      swal('Database error', error.message, 'error')
      return
    }
    this.setState({ toDashboard: true })
  }

  /**
   * @async
   * @Method ProductsEdit.render
   * @summary Component render function.
   * @description Renders a form to edit the Product data
   */
  render () {
    if (this.state.toDashboard === true) {
      return <Redirect to='/Products' />
    }
    return (
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4 main'>
        <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 bproduct-bottom'>
          <h1 className='h2'>Product Edit - {this.state.product.name}</h1>
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
                  value={this.state.product.name}
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
                  value={this.state.product.email}
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
                  value={this.state.product.address}
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
                  multiple
                  onChange={this.handleChangeFieldValue}
                  value={this.state.product.cards}
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

export default ProductsEdit
