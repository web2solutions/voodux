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
  const { error, /* document, foundation, */ data } = eventObj
  if (error) {
    console.error(`Error adding user: ${error}`)
    return
  }
  console.debug([data, ...this.state.customers])
  this.setState({ customers: [data, ...this.state.customers] })
}

const handlerOnEditDocEventListener = function (eventObj) {
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

/**
 * @author Eduardo Perotta de Almeida <web2solucoes@gmail.com>
 * @Component Customers
 * @description React component consuming a Customer Data Entity collection to feed a grid
 * @extends React.Component
 */
class Customers extends React.Component {
  constructor (props) {
    super(props)
    // console.error('------>', props)
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
      customers: []
    }
    this.onAddDocEventListener = null
    this.onEditDocEventListener = null
    this.onDeleteDocEventListener = null
    this.handleDeleteCustomer = this.handleDeleteCustomer.bind(this)
  }

  /**
   * @Method Customers.componentWillUnmount
   * @summary Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as cancelled network requests, or cleaning up any DOM elements created in componentDidMount.
   * @description lets stop listen to Customer Data State Change Events
   * @example
componentWillUnmount() {
  const { Customer } = this.foundation.data
  Customer.stopListenTo(this.onAddDocEventListener)
  Customer.stopListenTo(this.onEditDocEventListener)
  Customer.stopListenTo(this.onDeleteDocEventListener)
}
   */
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

  /**
   * @async
   * @Method Customers.componentDidMount
   * @summary Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * @description Once component is monted we are now ready to start listen to changes on Customer data entity and get a list of customer in database to fill out the state.customers
   * @example
componentDidMount() {
  const { Customer } = this.foundation.data

  this.onAddDocEventListener = Customer.on(
    'add',
    handlerOnAddDocEventListener.bind(this)
  )

  this.onEditDocEventListener = Customer.on(
    'edit',
    handlerOnEditDocEventListener.bind(this)
  )

  this.onDeleteDocEventListener = Customer.on(
    'delete',
    handlerOnDeleteDocEventListener.bind(this)
  )

  const { error, data } = await Customer.find({}, { ...this.pagination })
  if (!error) {
    this.setState({ customers: customers.data })
  }
}
   */
  async componentDidMount () {
    const { Customer } = this.foundation.data

    // listen to add, edit and delete events on Customer collection
    // and react to it
    /**
     * listen to add Customer Data Entity change event on Data API
     */
    this.onAddDocEventListener = Customer.on('add', handlerOnAddDocEventListener.bind(this))

    /**
     * listen to edit Customer Data Entity change event on Data API
     */
    this.onEditDocEventListener = Customer.on('edit', handlerOnEditDocEventListener.bind(this))

    /**
     * listen to delete Customer Data Entity change event on Data API
     */
    this.onDeleteDocEventListener = Customer.on('delete', handlerOnDeleteDocEventListener.bind(this))

    // get Customers on database
    const customers = await Customer.find({}, { ...this.pagination })
    // console.warn(customers)

    if (customers.data) {
      this.setState({ customers: customers.data })
    }
  }

  /**
   * @Method Customers.handleDeleteCustomer
   * @summary Event handler that Deletes a customer
   * @description Once component is monted we are now ready to start listen to changes on Customer data entity and get a list of customer in database to fill out the state.customers
   * @param  {event} event - The HTML event triggered on User interation
   * @param  {number} __id - The primaryKey value of the record willing to be deleted
   * @example
handleDeleteCustomer(e, ___id) {
  const { Customer } = this.foundation.data
  e.preventDefault()
  swal({
    title: 'Are you sure?',
    text: 'Once deleted, you will not be able to recover this!',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  }).then(async (willDelete) => {
    if (willDelete) {
      const r = await Customer.delete(___id)
      if (r.error) {
        swal('Database error', e.error.message, 'error')
        return
      }
      swal('Poof! The customer has been deleted!', {
        icon: 'success'
      })
      return <Redirect to = '/dashboard' / >
    } else {
      swal('The Customer is safe!')
    }
  })
}

// <a color='primary' href='#' onClick={e => this.handleDeleteCustomer(e, doc.__id)}>[delete]</a>
   */
  handleDeleteCustomer (e, ___id) {
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

  /**
   * @async
   * @Method Customers.render
   * @summary Component render function.
   * @description Renders a grid of Customers
   */
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
                <th align='right'>Cards</th>
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
