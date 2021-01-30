/* global  */
import React, { useState, useEffect } from 'react'
import { /* Link as RouterLink, */ useParams, useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import Checkbox from '@material-ui/core/Checkbox'
// import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import useStyles from './useStyles'
import swal from 'sweetalert'
export default function OrderEdit (props) {
  const [order, setOrder] = useState({
    name: '',
    shipTo: '',
    paymentMethod: '',
    amount: 0
  })

  const history = useHistory()

  const { Order } = props.foundation.data

  const { __id } = useParams()

  const classes = useStyles()

  const handleChangeFieldValue = e => {
    // e.preventDefault()
    const newHash = { ...order }
    newHash[e.target.id] = e.target.value
    setOrder(newHash)
  }

  const handleSaveForm = async e => {
    e.preventDefault()
    const form = e.currentTarget.form
    const isFormValid = form.reportValidity()
    if (!isFormValid) {
      return
    }

    const doc = { ...order }

    const { error } = await Order.edit(order.__id, doc)
    if (error) {
      swal('Database error', error.message, 'error')
      return
    }
    history.push('/Orders')
  }

  // listen to update Order Collection event on Data API
  props.foundation.on(`collection:edit:${props.entity.toLowerCase()}`, function (eventObj) {
    const { error } = eventObj
    if (error) {
      throw new Error(`Error updating user: ${error}`)
    }
    // update form
    // manage state by setting users avoiding race conditions
    // setOrder([...newData])
  })

  // listen to delete Order Collection event on Data API
  props.foundation.on(`collection:delete:${props.entity.toLowerCase()}`, function (eventObj) {
    const { error } = eventObj
    if (error) {
      throw new Error(`Error deleting user: ${error}`)
    }
    // close form
  })

  useEffect(async () => {
    // got order
    const findOrder = await Order.findById(__id)
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
                    value={order.name}
                    onChange={handleChangeFieldValue}
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
                    onChange={handleChangeFieldValue}
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
                    onChange={handleChangeFieldValue}
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
                    type='number'
                    onChange={handleChangeFieldValue}
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
                onClick={handleSaveForm}
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
