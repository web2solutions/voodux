/* global  */
import React, { useState } from 'react'
import { /* Link as RouterLink, */ useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import Chip from '@material-ui/core/Chip'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import useStyles from './useStyles'
import swal from 'sweetalert'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

export default function CustomerAdd (props) {
  const [customer, setCustomer] = useState({
    name: null,
    address: 'Seminole, FL',
    cards: [],
    email: null
  })

  const [cards, setCards] = useState(['VISA ⠀*** 3719'])

  const history = useHistory()

  const { Customer } = props.foundation.data

  const classes = useStyles()

  const handleChangeFieldValue = e => {
    // e.preventDefault()
    // console.error(e)
    const newHash = { ...customer }
    newHash[e.target.id || e.target.name] = e.target.value
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
                    id='address'
                    label='Address'
                    name='address'
                    onChange={handleChangeFieldValue}
                    value={customer.address}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='outlined'
                    required
                    fullWidth
                    id='email'
                    label='E-mail'
                    name='email'
                    onChange={handleChangeFieldValue}
                    value={customer.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel id='cards-label'>Registered Payment Methods</InputLabel>
                  <Select
                    variant='outlined'
                    labelId='cards-label'
                    id='cards'
                    name='cards'
                    multiple
                    required
                    fullWidth
                    value={customer.cards}
                    onChange={handleChangeFieldValue}
                    input={<Input id='select-multiple-chip' />}
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} className={classes.chip} />
                        ))}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {cards.map((card) => (
                      <MenuItem key={card} value={card}>
                        {card}
                      </MenuItem>
                    ))}
                  </Select>
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
