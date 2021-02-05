/* globals */
import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import swal from 'sweetalert'
/* import moment from 'moment'

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}) */

const handlerOnAddDocEventListener = function (eventObj) {
  console.error('handlerOnAddDocEventListener customer index.js')
  const { error, /* document, foundation, */ data } = eventObj
  if (error) {
    console.error(`Error adding user: ${error}`)
    return
  }
  console.debug([data, ...this.state.customers])
  this.setState({ customers: [data, ...this.state.customers] })
}

const handlerOnEditDocEventListener = function (eventObj) {
  console.error('handlerOnEditDocEventListener customer index.js')
  const { data, primaryKey, /* document, foundation, */ error } = eventObj
  if (error) {
    console.error(`Error updating user: ${error}`)
    return
  }
  const newData = this.state.customers.map((customer) => {
    if (customer.__id === primaryKey) {
      return data
    } else {
      return customer
    }
  })
  console.debug([...newData])
  this.setState({ customers: [...newData] })
}

const handlerOnDeleteDocEventListener = function (eventObj) {
  console.error('handlerOnDeleteDocEventListener customer index.js')
  const { error, /* document, foundation, */ data } = eventObj
  if (error) {
    console.error(`Error deleting user: ${error}`)
    return
  }
  const allCustomers = [...this.state.customers]
  for (let x = 0; x < allCustomers.length; x++) {
    const customer = allCustomers[x]
    if (customer.__id === data.__id) {
      allCustomers.splice(x)
    }
  }
  this.setState({ customers: allCustomers })
}

class Customers extends React.Component {
  constructor (props) {
    super(props)
    // console.error('------>', props)
    this.entity = 'Customer'
    this.foundation = props.foundation
    this.pagination = {
      offset: 0,
      limit: 30
    }
    this.state = {
      customers: []
    }
    this.onAddDocEventListener = null
    this.onEditDocEventListener = null
    this.onDeleteDocEventListener = null
    this.handleDeleteCustomer = this.handleDeleteCustomer.bind(this)
  }

  componentWillUnmount () {
    const { Customer } = this.foundation.data
    /**
     * Destroy event listeners of this component which are listening to Customer collection
     * and react to it
     */
    Customer.stopListenTo(this.onAddDocEventListener)
    Customer.stopListenTo(this.onEditDocEventListener)
    Customer.stopListenTo(this.onDeleteDocEventListener)
    this.onAddDocEventListener = null
    this.onEditDocEventListener = null
    this.onDeleteDocEventListener = null
  }

  async componentDidMount () {
    const { Customer } = this.foundation.data

    /**
     * listen to add, edit and delete events on Customer collection
     * and react to it
     */
    // listen to add Customer Collection event on Data API
    this.onAddDocEventListener = Customer.on('add', handlerOnAddDocEventListener.bind(this))
    // listen to edit Customer Collection event on Data API
    this.onEditDocEventListener = Customer.on('edit', handlerOnEditDocEventListener.bind(this))
    // listen to delete Customer Collection event on Data API
    this.onDeleteDocEventListener = Customer.on('delete', handlerOnDeleteDocEventListener.bind(this))

    // get Customers on database
    const customers = await Customer.find({}, { ...this.pagination })
    console.warn(customers)

    if (customers.data) {
      this.setState({ customers: customers.data })
    }
  }

  async handleDeleteCustomer (e, ___id) {
    const { Customer } = this.foundation.data
    e.preventDefault()
    // console.error(___id)
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this!',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(async (willDelete) => {
      if (willDelete) {
        const r = await Customer.delete(___id)
        // console.error(r)
        if (r.error) {
          swal('Database error', e.error.message, 'error')
          return
        }
        swal('Poof! The customer has been deleted!', {
          icon: 'success'
        })
        return <Redirect to='/dashboard' />
      } else {
        swal('The Customer is safe!')
      }
    })
  }

  render () {
    return (
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4 main'>
        <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 bcustomer-bottom'>
          <h1 className='h2'>Customers</h1>
          <div className='btn-toolbar mb-2 mb-md-0'>
            <div className='btn-group me-2'>
              <LinkContainer to='/CustomersAdd'>
                <button type='button' className='btn btn-sm btn-outline-secondary'>
                  Add new Customer
                </button>
              </LinkContainer>
            </div>
          </div>
        </div>
        <div className='table-responsive'>
          <table className='table table-striped table-sm'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>E-mail</th>
                <th>Cards</th>
                <th>-</th>
              </tr>
            </thead>
            <tbody>
              {this.state.customers.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.name}</td>
                  <td>{doc.address}</td>
                  <td>{doc.email}</td>
                  <td align='right'>{doc.cards}</td>
                  <td>
                    <Link color='primary' to={`/CustomersEdit/${doc.__id}`}>[edit]</Link>
                    | <a color='primary' href='#' onClick={e => this.handleDeleteCustomer(e, doc.__id)}>[delete]</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

    )
  }
}

export default Customers
