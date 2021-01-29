/* global window */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
import Title from './Title'
// import DashBoardListing from './DashBoardListing'

function preventDefault (event) {
  event.preventDefault()
}

export default function Orders (props) {
  const [orders, setOrders] = useState([])
  const { Order } = props.foundation.data

  const classes = useStyles()

  const handleAddOrder = async (e) => {
    // e.preventDefault()
    if (e.target.disabled) {
      return
    }
    console.error(e)
    e.target.disabled = true
    // e.target.className = e.target.className + ' Mui-disabled Mui-disabled'
    e.target.class = e.target.class + ' Mui-disabled Mui-disabled'
    //  disabled
    await Order.add({
      name: 'Elvis Presley',
      shipTo: 'Tupelo, MS',
      paymentMethod: 'VISA ⠀•••• 3719',
      amount: 312.44
    })
    e.target.disabled = false
    // e.target.className = e.target.className.replace(/ Mui-disabled Mui-disabled/g, '')
    e.target.class = e.target.class.replace(/ Mui-disabled Mui-disabled/g, '')
  }

  // listen to add Order Collection event on Data API
  props.foundation.on(`collection:add:${props.entity.toLowerCase()}`, function (eventObj) {
    const { foundation, error, document, data } = eventObj
    if (error) {
      throw new Error(`Error adding user: ${error}`)
    }
    // manage state by setting users avoiding race conditions
    setOrders([data, ...orders])
  })

  // listen to update Order Collection event on Data API
  props.foundation.on(`collection:update:${props.entity.toLowerCase()}`, function (eventObj) {
    const { foundation, error, document, data } = eventObj
    if (error) {
      throw new Error(`Error updating user: ${error}`)
    }
    const newData = orders.map(order => {
      if (order.__id === data.__id) {
        return data
      } else {
        return order
      }
    })
    // manage state by setting users avoiding race conditions
    setOrders([...newData])
  })

  // listen to delete Order Collection event on Data API
  props.foundation.on(`collection:delete:${props.entity.toLowerCase()}`, function (eventObj) {
    const { foundation, error, document, data } = eventObj
    if (error) {
      throw new Error(`Error deleting user: ${error}`)
    }
    const allOrders = [...orders]
    for (let x = 0; x < allOrders.length; x++) {
      const order = allOrders[x]
      if (order.__id === data.__id) {
        allOrders.splice(x)
      }
    }
    // manage state by setting users avoiding race conditions
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
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.shipTo}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell align='right'>{order.amount}</TableCell>
                    <TableCell align='right'>
                      <Link color='primary' to={`/OrdersEdit/${order.__id}`}>[edit]</Link> | <Link color='primary' href='#' onClick={preventDefault}>[delete]</Link>
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
