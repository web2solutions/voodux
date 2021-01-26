/* globals document, window */
import React from 'react'
import crud from './components/crud/'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.foundation = props.foundation
    this.state = {
      users: []
    }
  }

  render () {
    return (
      <crud foundation={this.foundation} />
    )
  }
}

export default App
