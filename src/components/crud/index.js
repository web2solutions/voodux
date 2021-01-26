/* globals document, window */
import React from 'react'

class CRUD extends React.Component {
  constructor (props) {
    super(props)
    console.error('------>', props)
    this.foundation = props.foundation
    this.state = {
      users: []
    }
  }

  async componentDidMount () {
    const { User, Product } = this.foundation.data

    this.foundation.on('collection:add:user', async function (eventObj) {
      const { data, application, error } = eventObj
      if (error) {
        throw new Error(`Error adding user: ${error}`)
      }
    })

    this.foundation.on('collection:update:user', async function (eventObj) {
      const { data, application, error } = eventObj
      if (error) {
        throw new Error(`Error updating user: ${error}`)
      }
    })

    this.foundation.on('collection:delete:user', async function (eventObj) {
      const { data, application, error } = eventObj
      if (error) {
        throw new Error(`Error deleting user: ${error}`)
      }
    })
    let users = await User.find({})
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

    users = await User.find({})
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
