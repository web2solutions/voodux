import React from 'react'
import clsx from 'clsx'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import useStyles from './useStyles'
import Chart from './Chart'
import Deposits from './Deposits'
import DashBoardListing from './DashBoardListing'

export default function Dashboard (props) {
  const classes = useStyles()
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)
  return (
    <>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <Chart entity='Order' foundation={props.foundation} />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            <Deposits entity='Order' foundation={props.foundation} />
          </Paper>
        </Grid>
        {/* Recent DashBoardListing */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <DashBoardListing entity='Order' foundation={props.foundation} />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
