/* global  */
import React, { useState, useEffect } from 'react'
import { /* Link as RouterLink, */ useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import Checkbox from '@material-ui/core/Checkbox'
// import Link from '@material-ui/core/Link'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
// import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
// import Input from '@material-ui/core/Input'

import useStyles from './useStyles'
import swal from 'sweetalert'

const orderObj = {
  name: null,
  shipTo: null,
  paymentMethod: null,
  amount: null,
  customerId: null
}

export default function OrderAdd (props) {
  const [order, setOrder] = useState(orderObj)

  const [customers, setCustomers] = useState([])

  const history = useHistory()

  const { Order, Customer } = props.foundation.data

  const classes = useStyles()

  const handleChangeFieldValue = async e => {
    // e.preventDefault()
    // console.debug(e)
    if (e.target) {
      if (e.target.value === null || e.target.value === 'null') {
        const copy = { ...orderObj }
        delete copy.amount
        // console.debug(copy)
        setOrder(copy)
        return
      }
    }
    const newHash = { ...order }
    if (e.target.id) {
      if (e.target.id === 'amount') {
        newHash[e.target.id] = e.target.value
      }
    } else {
      const { name, value } = e.target
      if (name === 'name') {
        const { data, error } = await Customer.findById(value)
        if (error) {
          return
        }
        newHash.customerId = value
        newHash.name = data.name
        newHash.shipTo = data.address
        newHash.paymentMethod = data.cards[0]
      }
    }
    // console.error(newHash)
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

    const { error } = await Order.add(doc)
    if (error) {
      swal('Database error', error.message, 'error')
      return
    }
    history.push('/Orders')
  }

  useEffect(async () => {
    // got customers
    const findCustomers = await Customer.find({})
    if (!findCustomers) {
      return
    }
    if (findCustomers.data) {
      setCustomers(findCustomers.data)
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
                  <InputLabel id='name-label'>Buyer</InputLabel>
                  <Select
                    variant='outlined'
                    fullWidth
                    labelId='name-label'
                    id='name'
                    name='name'
                    value={order.customerId}
                    onChange={handleChangeFieldValue}
                  >
                    <MenuItem key={null} value={null}>
                      please selecte one
                    </MenuItem>
                    {customers.map(({ name, __id }) => (
                      <MenuItem key={__id} value={__id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
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
