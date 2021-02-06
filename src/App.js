/* globals document, window, feather, Chart */
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route, Link, useHistory } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import Dashboard from './components/dashboard'
import Orders from './components/orders'
import OrdersAdd from './components/orders/OrdersAdd'
import Customers from './components/customers'
import CustomersAdd from './components/customers/CustomersAdd'
import CustomersEdit from './components/customers/CustomersEdit'

import './App.css'

function App (props) {
  // const [users, setUsers] = useState([])

  useEffect(() => {
    feather.replace()
  }, [])

  const _foundation = props.foundation

  // const history = useHistory()

  // function handleClick () {
  //  history.push('/Users')
  // }

  return (
    <>
      <BrowserRouter>
        <header className='navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow'>
          <a className='navbar-brand col-md-3 col-lg-2 me-0 px-3' href='#'>Company name</a>
          <button className='navbar-toggler position-absolute d-md-none collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#sidebarMenu' aria-controls='sidebarMenu' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon' />
          </button>
          <input className='form-control form-control-dark w-100' type='text' placeholder='Search' aria-label='Search' />
          <ul className='navbar-nav px-3'>
            <li className='nav-item text-nowrap'>
              <a className='nav-link' href='#'>Sign out</a>
            </li>
          </ul>
        </header>

        <div className='container-fluid'>
          <div className='row'>
            <nav id='sidebarMenu' className='col-md-3 col-lg-2 d-md-block bg-light sidebar collapse'>
              <div className='position-sticky pt-3'>
                <ul className='nav flex-column'>
                  <li className='nav-item'>
                    <LinkContainer to='/'>
                      <a className='nav-link active' aria-current='page' href='#'>
                        <span data-feather='home' />
                        Dashboard
                      </a>
                    </LinkContainer>
                  </li>
                  <li className='nav-item active'>
                    <LinkContainer to='/Orders'>
                      <a className='nav-link' href='#'>
                        <span data-feather='file' />
                        Orders
                      </a>
                    </LinkContainer>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link' href='#'>
                      <span data-feather='shopping-cart' />
                      Products
                    </a>
                  </li>
                  <li className='nav-item'>
                    <LinkContainer to='/Customers'>
                      <a className='nav-link' href='#'>
                        <span data-feather='users' />
                        Customers
                      </a>
                    </LinkContainer>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link' href='#'>
                      <span data-feather='bar-chart-2' />
                      Reports
                    </a>
                  </li>
                  <li className='nav-item'>
                    <a className='nav-link' href='#'>
                      <span data-feather='layers' />
                      Integrations
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
            <Switch>
              <Route path='/Orders'>
                <Orders entity='Order' foundation={props.foundation} />
              </Route>
              <Route path='/OrdersAdd'>
                <OrdersAdd entity='Order' foundation={props.foundation} />
              </Route>
              <Route path='/Customers'>
                <Customers entity='Customer' foundation={props.foundation} />
              </Route>

              <Route
                exact
                path='/CustomersEdit/:__id'
                render={(props) => <CustomersEdit entity='Customer' foundation={_foundation} {...props} />}
              />

              <Route path='/CustomersAdd'>
                <CustomersAdd entity='Customer' foundation={props.foundation} />
              </Route>
              <Route path='/'>
                <Dashboard foundation={props.foundation} />
              </Route>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
