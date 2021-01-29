/* global window */
import React, { useState, useEffect } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import useStyles from './useStyles'

function preventDefault (event) {
  event.preventDefault()
}


export default function OrderEdit (props) {
  console.error('OrderEdit OrderEdit')
  const [order, setOrder] = useState({
    name: '',
    shipTo: '',
    paymentMethod: '',
    amount: 0
  })
  const { Order } = props.foundation.data

  let { __id } = useParams()

  const classes = useStyles()

  const handleChangeName = async (e) => {
    // e.preventDefault()
    console.error(e)
    // this.setState({value: event.target.value});
  }

  // listen to update Order Collection event on Data API
  props.foundation.on(`collection:update:${props.entity.toLowerCase()}`, function (eventObj) {
    const { foundation, error, document, data } = eventObj
    if (error) {
      throw new Error(`Error updating user: ${error}`)
    }
    // update form
    // manage state by setting users avoiding race conditions
    // setOrder([...newData])
  })

  // listen to delete Order Collection event on Data API
  props.foundation.on(`collection:delete:${props.entity.toLowerCase()}`, function (eventObj) {
    const { foundation, error, document, data } = eventObj
    if (error) {
      throw new Error(`Error deleting user: ${error}`)
    }
    // close form
  })

  useEffect(async () => {
    // got order
    const findOrder = await Order.findById(__id)
    console.log(__id, findOrder)
    if (!findOrder) {
      return
    }
    if (findOrder.data) {
      setOrder(findOrder.data)
    }
  }, []) // run one time only

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete='aname'
                    name='name'
                    variant='outlined'
                    required
                    fullWidth
                    id='name'
                    label='Name'
                    autoFocus
                    defaultValue={order.name}
                    value={order.name}
                    onChange={handleChangeName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    required
                    fullWidth
                    id='shipTo'
                    label='Ship to'
                    name='shipTo'
                    autoComplete='ashipto'
                    defaultValue={order.shipTo}
                    value={order.shipTo}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    required
                    fullWidth
                    id='paymentMethod'
                    label='Payment method'
                    name='paymentMethod'
                    autoComplete='apaymentmethod'
                    defaultValue={order.paymentMethod}
                    value={order.paymentMethod}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    required
                    fullWidth
                    name='amount'
                    label='Sale Amount'
                    id='amount'
                    autoComplete='aamount'
                    defaultValue={order.amount}
                    value={order.amount}
                  />
                </Grid>
              </Grid>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                className={classes.submit}
                onClick={preventDefault}
              >
                Save
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
