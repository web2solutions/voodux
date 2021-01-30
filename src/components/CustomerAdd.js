/* global  */
import React, { useState } from 'react'
import { /* Link as RouterLink, */ useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import Checkbox from '@material-ui/core/Checkbox'
// import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import useStyles from './useStyles'
import swal from 'sweetalert'
export default function CustomerAdd (props) {
  const [customer, setCustomer] = useState({
    name: null,
    address: 'Seminole, FL',
    cards: ['VISA ⠀*** 3719'],
    email: null
  })

  const history = useHistory()

  const { Customer } = props.foundation.data

  const classes = useStyles()

  const handleChangeFieldValue = e => {
    // e.preventDefault()
    const newHash = { ...customer }
    newHash[e.target.id] = e.target.value
    setCustomer(newHash)
  }

  const handleSaveForm = async e => {
    e.preventDefault()
    const form = e.currentTarget.form
    const isFormValid = form.reportValidity()
    if (!isFormValid) {
      return
    }

    const doc = { ...customer }

    const { error } = await Customer.add(doc)
    if (error) {
      swal('Database error', error.message, 'error')
      return
    }
    history.push('/Customers')
  }

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
                    value={customer.name}
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
                    value={customer.shipTo}
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
                    value={customer.paymentMethod}
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
                    value={customer.amount}
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
