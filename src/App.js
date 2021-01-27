/* globals document, window */
import React from 'react'
import Crud from './components/crud/Crud'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.foundation = props.foundation
    this.state = {
      users: []
    }
    console.error('START APP')
  }

  render () {
    console.error('App render ')
    return (
      <Crud entity='User' foundation={this.foundation} />
    )
  }
}

export default App
