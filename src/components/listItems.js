import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import CancelIcon from '@material-ui/icons/Cancel'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import PeopleIcon from '@material-ui/icons/People'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import SettingsIcon from '@material-ui/icons/Settings'
import PersonIcon from '@material-ui/icons/Person'

function ListItemLink (props) {
  const { icon, primary, to } = props

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  )

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
}

export const mainListItems = (
  <div>
    <ListItemLink to='/' primary='Dashboard' icon={<DashboardIcon />} />
    <ListItemLink to='/Orders' primary='Orders' icon={<ShoppingCartIcon />} />
    <ListItemLink to='/Customers' primary='Customers' icon={<PeopleIcon />} />
  </div>
)

export const secondaryListItems = (
  <div>
    <ListItemLink to='/Users' primary='Users' icon={<PersonIcon />} />
    <ListItemLink to='/Login' primary='Login' icon={<CheckCircleIcon />} />
    <ListItemLink to='/Logout' primary='Logout' icon={<CancelIcon />} />
    <ListItemLink to='/Settings' primary='Settings' icon={<SettingsIcon />} />
  </div>
)
