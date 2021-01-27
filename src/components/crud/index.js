/* globals document, window */
import React from 'react'

import collectionOnAddUser from './events/collectionOnAddUser'
import collectionOnUpdateUser from './events/collectionOnUpdateUser'
import collectionOnDeleteUser from './events/collectionOnDeleteUser'


class CRUD extends React.Component {
  constructor (props) {
    super(props)
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
  }

  async componentDidMount () {
    const { User, Product } = this.foundation.data

    // listen to add User event on Data API
    this.foundation.on('collection:add:user', collectionOnAddUser.bind(this))
    // listen to update User event on Data API
    this.foundation.on('collection:update:user', collectionOnUpdateUser.bind(this))
    // listen to delete User event on Data API
    this.foundation.on('collection:delete:user', collectionOnDeleteUser.bind(this))

    let users = await User.find({}, { ...this.pagination })
    console.warn(users)

    if (users.data.length === 0) {
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

    users = await User.find({}, { ...this.pagination })
    console.warn(users)

    if (users.data) {
      this.setState({ users: users.data })
    }

    /* window.setInterval(async () => {
      await User.add({
        name: 'Eduardo Almeida',
        username: 'web2'
      })
      users = await User.find({})
      if (users.data) {
        this.setState({ users: users.data })
      }
    }, 1) */

    document.getElementById('guid').innerText = 'Aplication GUID -> ' + this.foundation.guid
  }

  render () {
    return (
      <div className='game'>
        <div className='game-board'>I'm react caralhooooooo</div>
        <ul>
          {this.state.users
            .map(({ __id, name }) =>
              <li key={__id}>{__id} - {name}</li>)}
        </ul>
      </div>
    )
  }
}

// ========================================

export default CRUD
