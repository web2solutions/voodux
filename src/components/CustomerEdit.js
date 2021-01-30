/* global  */
import React, { useState, useEffect } from 'react'
import { /* Link as RouterLink, */ useParams, useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import Checkbox from '@material-ui/core/Checkbox'
// import Link from '@material-ui/core/Link'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
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

export default function CustomerEdit (props) {
  const [customer, setCustomer] = useState({
    name: null,
    address: null,
    cards: [],
    email: null
  })

  const [cards, setCards] = useState(['VISA ⠀*** 3719'])

  const history = useHistory()

  const { Customer } = props.foundation.data

  const { __id } = useParams()

  const classes = useStyles()

  const handleChangeFieldValue = e => {
    // e.preventDefault()
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
    // console.error(doc)
    const { error, data } = await Customer.edit(customer.__id, doc)
    // console.error({ error, data })
    if (error) {
      swal('Database error', error.message, 'error')
      return
    }
    history.push('/Customers')
  }

  // listen to update Customer Collection event on Data API
  props.foundation.on(`collection:edit:${props.entity.toLowerCase()}`, function (eventObj) {
    const { error } = eventObj
    if (error) {
      // console.error(error)
    }
    // update form
    // manage state by setting users avoiding race conditions
    // setCustomer([...newData])
  })

  // listen to delete Customer Collection event on Data API
  props.foundation.on(`collection:delete:${props.entity.toLowerCase()}`, function (eventObj) {
    const { error } = eventObj
    if (error) {
      // console.error(error)
    }
    // close form
    history.push('/Customers')
  })

  useEffect(async () => {
    // got customer
    const findCustomer = await Customer.findById(__id)
    if (!findCustomer) {
      return
    }
    if (findCustomer.data) {
      setCustomer(findCustomer.data)
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
