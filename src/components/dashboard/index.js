/* globals document */
import React from 'react'
import Chart from './Chart'
// import swal from 'sweetalert'
import moment from 'moment'

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    // console.error('------>', props)
    this.entity = 'Order'
    this.foundation = props.foundation
    this.pagination = {
      offset: 0,
      limit: 30
    }
    this.state = {
      orders: []
    }
    this.onAddDocEventListener = null
    this.onEditDocEventListener = null
    this.onDeleteDocEventListener = null
  }

  componentWillUnmount () {
    this.foundation.stopListenTo(this.onAddDocEventListener)
    this.foundation.stopListenTo(this.onEditDocEventListener)
    this.foundation.stopListenTo(this.onDeleteDocEventListener)
    this.onAddDocEventListener = null
    this.onEditDocEventListener = null
    this.onDeleteDocEventListener = null
  }

  async componentDidMount () {
    const { Order } = this.foundation.data
    this.onAddDocEventListener = this.foundation.on(`collection:add:${this.entity.toLowerCase()}`, function (eventObj) {
      console.error('onAddDocEventListener dashboard')
      const { error, /* document, foundation, */ data } = eventObj
      if (error) {
        console.error(`Error adding user: ${error}`)
        return
      }
      this.setState({ orders: [data, ...this.state.orders] })
    })

    // listen to update Order Collection event on Data API
    this.onEditDocEventListener = this.foundation.on(`collection:edit:${this.entity.toLowerCase()}`, function (eventObj) {
      console.error('onEditDocEventListener dashboard')
      const { data, primaryKey, /* document, foundation, */ error } = eventObj
      if (error) {
        console.error(`Error updating user: ${error}`)
        return
      }
      const newData = this.state.orders.map(order => {
        if (order.__id === primaryKey) {
          return data
        } else {
          return order
        }
      })
      this.setState({ orders: [...newData] })
    })

    // listen to delete Order Collection event on Data API
    this.onDeleteDocEventListener = this.foundation.on(`collection:delete:${this.entity.toLowerCase()}`, function (eventObj) {
      console.error('onDeleteDocEventListener dashboard')
      const { error, /* document, foundation, */ data } = eventObj
      if (error) {
        console.error(`Error deleting user: ${error}`)
        return
      }
      const allOrders = [...this.state.orders]
      for (let x = 0; x < allOrders.length; x++) {
        const order = allOrders[x]
        if (order.__id === data.__id) {
          allOrders.splice(x)
        }
      }
      this.setState({ orders: allOrders })
    })

    // get Users on database
    const orders = await Order.find({}, { ...this.pagination })
    console.warn(orders)

    if (orders.data) {
      this.setState({ orders: orders.data })
    }
  }

  render () {
    return (
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4 main'>
        <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
          <h1 className='h2'>Dashboard</h1>
          <div className='btn-toolbar mb-2 mb-md-0'>
            <div className='btn-group me-2'>
              <button type='button' className='btn btn-sm btn-outline-secondary'>
                Share
              </button>
              <button type='button' className='btn btn-sm btn-outline-secondary'>
                Export
              </button>
            </div>
            <button
              type='button'
              className='btn btn-sm btn-outline-secondary dropdown-toggle'
            >
              <span data-feather='calendar' />
              This week
            </button>
          </div>
        </div>
        <Chart foundation={this.props.foundation} />
        <h2>Orders</h2>
        <div className='table-responsive'>
          <table className='table table-striped table-sm'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Ship To</th>
                <th>Payment method</th>
                <th align='right'>Amount</th>
              </tr>
            </thead>
            <tbody>
              {this.state.orders.map((doc) => (
                <tr key={doc.id}>
                  <td>{moment(doc.date).startOf('hour').fromNow()}</td>
                  <td>{doc.name}</td>
                  <td>{doc.shipTo}</td>
                  <td>{doc.paymentMethod}</td>
                  <td align='right'>USD {formatter.format(doc.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

    )
  }
}

export default Dashboard
