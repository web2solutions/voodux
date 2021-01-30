/* global  */
import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
// import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import useStyles from './useStyles'

import swal from 'sweetalert'
import moment from 'moment'

import Title from './Title'

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export default function Orders (props) {
  const [orders, setOrders] = useState([])
  const { Order } = props.foundation.data

  const history = useHistory()

  const classes = useStyles()

  const handleAddOrder = (e) => {
    e.preventDefault()
    history.push('/OrdersAdd')
  }

  const handleDeleteOrder = async (e, ___id) => {
    e.preventDefault()
    console.error(___id)
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this!',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(async (willDelete) => {
      if (willDelete) {
        const r = await Order.delete(___id)
        console.error(r)
        if (r.error) {
          swal('Database error', e.error.message, 'error')
          return
        }
        swal('Poof! The order has been deleted!', {
          icon: 'success'
        })
      } else {
        swal('The Order is safe!')
      }
    })
  }

  // listen to add Order Collection event on Data API
  props.foundation.on(`collection:add:${props.entity.toLowerCase()}`, function (eventObj) {
    const { error, /* document, foundation, */ data } = eventObj
    if (error) {
      console.error(`Error adding user: ${error}`)
      return
    }
    setOrders([data, ...orders])
  })

  // listen to update Order Collection event on Data API
  props.foundation.on(`collection:edit:${props.entity.toLowerCase()}`, function (eventObj) {
    const { data, primaryKey, /* document, foundation, */ error } = eventObj
    if (error) {
      console.error(`Error updating user: ${error}`)
      return
    }
    const newData = orders.map(order => {
      if (order.__id === primaryKey) {
        return data
      } else {
        return order
      }
    })
    setOrders([...newData])
  })

  // listen to delete Order Collection event on Data API
  props.foundation.on(`collection:delete:${props.entity.toLowerCase()}`, function (eventObj) {
    const { error, /* document, foundation, */ data } = eventObj
    if (error) {
      console.error(`Error deleting user: ${error}`)
      return
    }
    const allOrders = [...orders]
    for (let x = 0; x < allOrders.length; x++) {
      const order = allOrders[x]
      if (order.__id === data.__id) {
        allOrders.splice(x)
      }
    }
    setOrders(allOrders)
  })

  useEffect(async () => {
    // got orders
    const findOrders = await Order.find({})
    if (!findOrders) {
      return
    }
    if (findOrders.data) {
      setOrders(findOrders.data)
    }
  }, []) // run one time only

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Title>Orders</Title>
            <ButtonGroup color='primary' aria-label='outlined primary button group'>
              <Button onClick={handleAddOrder}>Add</Button>
            </ButtonGroup>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Ship To</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell align='right'>Sale Amount</TableCell>
                  <TableCell align='right'>actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{moment(order.date).subtract(6, 'days').calendar()}</TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.shipTo}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell align='right'>USD {formatter.format(order.amount)}</TableCell>
                    <TableCell align='right'>
                      <Link color='primary' to={`/OrdersEdit/${order.__id}`}>[edit]</Link> | <Link color='primary' href='#' style={{ display: 'none' }} onClick={e => handleDeleteOrder(e, order.__id)}>[delete]</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className={classes.seeMore}> Paging goes here </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
