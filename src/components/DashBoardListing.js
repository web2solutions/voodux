import React, { useState, useEffect } from 'react'
// import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Title from './Title'

function preventDefault (event) {
  event.preventDefault()
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3)
  }
}))

export default function DashBoardListing (props) {
  const [documents, setDocuments] = useState([])
  const DataAPI = props.foundation.data

  const handleAddDocument = async (e) => {
    e.preventDefault()
    await DataAPI[props.entity].add({
      name: 'Elvis Presley',
      shipTo: 'Tupelo, MS',
      paymentMethod: 'VISA ⠀•••• 3719',
      amount: 312.44
    })
  }

  // listen to add props.entity Collection event on Data API
  props.foundation.on(`collection:add:${props.entity.toLowerCase()}`, function (eventObj) {
    const { foundation, error, document, data } = eventObj
    if (error) {
      throw new Error(`Error adding user: ${error}`)
    }
    // manage state by setting users avoiding race conditions
    setDocuments([data, ...documents])
  })

  // listen to update props.entity Collection event on Data API
  props.foundation.on(`collection:update:${props.entity.toLowerCase()}`, function (eventObj) {
    const { foundation, error, document, data } = eventObj
    if (error) {
      throw new Error(`Error updating user: ${error}`)
    }
    const newData = documents.map(doc => {
      if (doc.__id === data.__id) {
        return data
      } else {
        return doc
      }
    })
    // manage state by setting users avoiding race conditions
    setDocuments([...newData])
  })

  // listen to delete props.entity Collection event on Data API
  props.foundation.on(`collection:delete:${props.entity.toLowerCase()}`, function (eventObj) {
    const { foundation, error, document, data } = eventObj
    if (error) {
      throw new Error(`Error deleting user: ${error}`)
    }
    const allDocuments = [...documents]
    for (let x = 0; x < allDocuments.length; x++) {
      const doc = allDocuments[x]
      if (doc.__id === data.__id) {
        allDocuments.splice(x)
      }
    }
    // manage state by setting users avoiding race conditions
    setDocuments(allDocuments)
  })

  useEffect(async () => {
    // got documents
    const findDocuments = await DataAPI[props.entity].find({})
    if (findDocuments.data) {
      setDocuments(findDocuments.data)
    }
  }, []) // run one time only

  const classes = useStyles()
  return (
    <>
      <Title>Recent {props.entity}</Title>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align='right'>Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.date}</TableCell>
              <TableCell>{doc.name}</TableCell>
              <TableCell>{doc.shipTo}</TableCell>
              <TableCell>{doc.paymentMethod}</TableCell>
              <TableCell align='right'>{doc.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Button variant='contained' color='primary' onClick={handleAddDocument}>
          Add doc
        </Button>
      </div>
    </>
  )
}
