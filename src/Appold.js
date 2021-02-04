/* globals document, window */
import React, { useState } from 'react'
import { BrowserRouter, Switch, Route, Link, useHistory } from 'react-router-dom'

import Crud from './components/crud/Crud'
import CrudAdd from './components/crud/CrudAdd'
import CrudEdit from './components/crud/CrudEdit'


import './App.css'

function App (props) {
  const [users, setUsers] = useState([])

  // const history = useHistory()

  // function handleClick () {
  //  history.push('/Users')
  // }

  return (
    <>
      <BrowserRouter>
        <header>
          <nav className='navbar navbar-expand-md navbar-dark fixed-top bg-dark'>
            <Link className='navbar-brand' color='primary' to='/'>Dashboard</Link>
            <button
              className='navbar-toggler'
              type='button'
              data-toggle='collapse'
              data-target='#navbarCollapse'
              aria-controls='navbarCollapse'
              aria-expanded='false'
              aria-label='Toggle navigation'
            >
              <span className='navbar-toggler-icon' />
            </button>
            <div className='collapse navbar-collapse' id='navbarCollapse'>
              <ul className='navbar-nav mr-auto'>
                <li className='nav-item active'>
                  <Link className='nav-link' color='primary' to='/Users'>Users</Link>
                </li>
                <li className='nav-item'>
                  <a className='nav-link disabled' href='#'>
                    Disabled
                  </a>
                </li>
              </ul>
              <form className='form-inline mt-2 mt-md-0'>
                <input
                  className='form-control mr-sm-2'
                  type='text'
                  placeholder='Search'
                  aria-label='Search'
                />
                <button
                  className='btn btn-outline-primary my-2 my-sm-0'
                  type='submit'
                >
                  Search
                </button>
              </form>
            </div>
          </nav>
        </header>
        <main role='main' className='container appDrawer'>
          <Switch>
            <Route path='/Users'>
              <Crud entity='User' useHistory={useHistory()} foundation={props.foundation} />
            </Route>
            <Route path='/UsersEdit/:__id'>
              <CrudEdit entity='User' useHistory={useHistory()} foundation={props.foundation} />
            </Route>
            <Route path='/UsersAdd'>
              <CrudAdd entity='User' useHistory={useHistory()} foundation={props.foundation} />
            </Route>
            <Route path='/'>
              <div>dash board</div>
            </Route>
          </Switch>
        </main>

        <footer className='footer'>
          <div className='container'>
            <span id='guid' className='text-muted'>
              Place sticky footer content here.
            </span>
          </div>
        </footer>
      </BrowserRouter>
    </>
  )
}

export default App
