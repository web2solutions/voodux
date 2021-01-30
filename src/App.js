import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import clsx from 'clsx'

import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import Container from '@material-ui/core/Container'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NotificationsIcon from '@material-ui/icons/Notifications'

import useStyles from './components/useStyles'

import { mainListItems, secondaryListItems } from './components/listItems'
import Dashboard from './components/Dashboard'
import Copyright from './components/Copyright'
import Orders from './components/Orders'
import OrderEdit from './components/OrderEdit'
import OrderAdd from './components/OrderAdd'

import Customers from './components/Customers'
import CustomerEdit from './components/CustomerEdit'
import CustomerAdd from './components/CustomerAdd'

export default function App (props) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position='absolute' className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Route>
              {({ location }) => (
                <Typography component='h1' variant='h6' color='inherit' noWrap className={classes.title}>
                  {location.pathname.replace(/\//g, '')}
                </Typography>
              )}
            </Route>
            <IconButton color='inherit'>
              <Badge badgeContent={4} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant='permanent'
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>{mainListItems}</List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth='lg' className={classes.container}>
            <Switch>
              <Route path='/Orders'>
                <Orders entity='Order' foundation={props.foundation} />
              </Route>
              <Route path='/OrdersEdit/:__id'>
                <OrderEdit entity='Order' foundation={props.foundation} />
              </Route>
              <Route path='/OrdersAdd'>
                <OrderAdd entity='Order' foundation={props.foundation} />
              </Route>
              <Route path='/Customers'>
                <Customers entity='Customer' foundation={props.foundation} />
              </Route>
              <Route path='/CustomersEdit/:__id'>
                <CustomerEdit entity='Customer' foundation={props.foundation} />
              </Route>
              <Route path='/CustomersAdd'>
                <CustomerAdd entity='Customer' foundation={props.foundation} />
              </Route>
              <Route path='/'>
                <Dashboard foundation={props.foundation} />
              </Route>
            </Switch>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </Router>
  )
}
