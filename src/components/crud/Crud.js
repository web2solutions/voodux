/* globals document, window */
import React from 'react'
import { collectionOnAdd } from './events/collectionOnAdd'
import { collectionOnUpdate } from './events/collectionOnUpdate'
import { collectionOnDelete } from './events/collectionOnDelete'

class Crud extends React.Component {
  constructor (props) {
    super(props)
    try {
      console.error('------>', props)
      this.entity = props.entity
      this.foundation = props.foundation
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
  }

  async componentDidMount () {
    const { User, Product } = this.foundation.data

    // listen to add User Collection event on Data API
    this.foundation.on(`collection:add:${this.entity.toLowerCase()}`, collectionOnAdd.bind(this))

    // listen to update User Collection event on Data API
    this.foundation.on(`collection:update:${this.entity.toLowerCase()}`, collectionOnUpdate.bind(this))

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

    document.getElementById('guid').innerText = 'Aplication GUID -> ' + this.foundation.guid
  }

  async handleAddDocument (e) {
    e.preventDefault()
    const { User } = this.foundation.data
    await User.add({
      name: 'Eduardo Almeida',
      username: 'web2'
    })
  }

  render () {
    return (
      <div className='game'>
        <ul>
          {this.state.users.map(({ __id, name }) => (<li key={__id}>{__id} - {name}</li>))}
        </ul>
        <button type='button' className='btn btn-success' onClick={this.handleAddDocument}>add user</button>
      </div>
    )
  }
}

export default Crud
