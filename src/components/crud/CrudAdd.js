/* globals document */
import React from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { collectionOnAdd } from './events/collectionOnAdd'
import { collectionOnUpdate } from './events/collectionOnUpdate'
import { collectionOnDelete } from './events/collectionOnDelete'

import { uuid } from '../../foundation/utils'


class Crud extends React.Component {
  constructor (props) {
    super(props)
    try {
      // console.error('------>', props)
      this.entity = props.entity
      this.foundation = props.foundation
      this.history = props.useHistory
      this.pagination = {
        offset: 0,
        limit: 30
      }
      this.state = {
        users: []
      }
    } catch (error) {
      console.error(error)
    }
    this.handleAddDocument = this.handleAddDocument.bind(this)
    this.handleEditDocument = this.handleEditDocument.bind(this)
  }

  async componentDidMount () {
    const { User, Product } = this.foundation.data

    // listen to add User Collection event on Data API
    this.foundation.on(`collection:add:${this.entity.toLowerCase()}`, collectionOnAdd.bind(this))

    // listen to update User Collection event on Data API
    this.foundation.on(`collection:edit:${this.entity.toLowerCase()}`, collectionOnUpdate.bind(this))

    // listen to delete User Collection event on Data API
    this.foundation.on(`collection:delete:${this.entity.toLowerCase()}`, collectionOnDelete.bind(this))

    // get Users on database
    const users = await User.find({}, { ...this.pagination })
    console.warn(users)

    if (users.data) {
      this.setState({ users: users.data })
    }

    const counter = await User.count()
    console.warn(counter)
    if (counter.data < 1) {
      await User.add({
        name: 'Eduardo Almeida',
        username: 'web2'
      })

      await Product.add({
        name: 'Volvo XC90',
        vendor: 'Volvo',
        price_cost: 150000
      })
    }

    document.getElementById('guid').innerText = 'Aplication GUID -> ' + this.foundation.guid + ' / ' + this.foundation.tabId
  }

  async handleAddDocument (e) {
    e.preventDefault()
    this.history.push('/UsersAdd')
    /* const { User } = this.foundation.data
    await User.add({
      name: 'Eduardo Almeida',
      username: 'web2'
    }) */
  }

  async handleEditDocument (e) {
    e.preventDefault()
    const { User } = this.foundation.data
    await User.edit(1, {
      name: 'Eduardo Almeida',
      username: uuid()
    })
  }

  render () {
    return (
      <div className='card'>
        <div className='card-header'>
          <LinkContainer to='/UsersAdd'>
            <button type='button' className='btn btn-success'>add user</button>
          </LinkContainer>
          <LinkContainer to='/UsersEdit/1'>
            <button type='button' className='btn btn-warning'>edit user</button>
          </LinkContainer>
        </div>
        <div className='card-body' style={{ overflow: 'auto' }}>
          <ul style={{ overflow: 'auto' }}>
            {this.state.users.map(({ __id, name, username }) => (<li key={__id}>{__id} - {name} - {username}</li>))}
          </ul>
        </div>
        <div className='card-footer'>
          xxxxx
        </div>
      </div>
    )
  }
}

export default Crud
