import React, { useState, useEffect } from 'react'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer
} from 'recharts'

import moment from 'moment'

/* const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}) */
/**
 * @author Eduardo Perotta de Almeida <web2solucoes@gmail.com>
 * @Component Chart
 * @description React component consuming a Order Data Entity collection to feed a grid
 * @extends React.Component
 */
class Chart extends React.Component {
  constructor (props) {
    super(props)
    // console.error('------>', props)
    this.entity = 'Order'
    this.foundation = props.foundation
    this.state = {
      series: [
        { time: '00:00', amount: 0 },
        { time: '24:00', amount: undefined }
      ]
    }
    this.onAddDocEventListener = null
    this.onEditDocEventListener = null
    this.onDeleteDocEventListener = null

    this.handlerChangeOrder = this.handlerChangeOrder.bind(this)
  }

  async setSeries () {
    const { Order } = this.foundation.data
    const { error, data } = await Order.find({})
    if (error) {
      return
    }
    let _total = 0
    const series = data.reverse().map(({ date, amount }) => {
      _total = _total + amount
      return {
        amount: _total,
        time: moment(date).format('HH:mm:ss'),
        mseconds: new Date(date).getTime()
      }
    })
    const final = [
      { time: '00:00', amount: 0 },
      ...series.slice().sort((a, b) => a.mseconds - b.mseconds),
      { time: '24:00', amount: undefined }
    ]
    // console.log(final)
    this.setState({ series: final })
  }

  async handlerChangeOrder (eventObj) {
    console.error('handlerChangeOrder chart')
    const { error } = eventObj
    if (error) {
      return
    }
    await this.setSeries()
  }

  /**
   * @Method Chart.componentWillUnmount
   * @summary Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as cancelled network requests, or cleaning up any DOM elements created in componentDidMount.
   * @description lets stop listen to Order Data State Change Events
   * @example
componentWillUnmount() {
  const { Order } = this.foundation.data
  Order.stopListenTo(this.onAddDocEventListener)
  Order.stopListenTo(this.onEditDocEventListener)
  Order.stopListenTo(this.onDeleteDocEventListener)
}
   */
  componentWillUnmount () {
    const { Order } = this.foundation.data
    /**
     * Destroy event listeners of this component which are listening to Order collection
     * and react to it
     */
    Order.stopListenTo(this.onAddDocEventListener)
    Order.stopListenTo(this.onEditDocEventListener)
    Order.stopListenTo(this.onDeleteDocEventListener)
    this.onAddDocEventListener = null
    this.onEditDocEventListener = null
    this.onDeleteDocEventListener = null
  }

  /**
   * @async
   * @Method Chart.componentDidMount
   * @summary Called immediately after a component is mounted. Setting state here will trigger re-rendering.
   * @description Once component is monted we are now ready to start listen to changes on Order data entity and get a list of order in database to fill out the state.orders
   * @example
componentDidMount() {
  const { Order } = this.foundation.data

  // listen to add, edit and delete events on Order collection
  // and react to it
  this.onAddDocEventListener = Order.on('add', this.handlerChangeOrder)
  this.onEditDocEventListener = Order.on('edit', this.handlerChangeOrder)
  this.onDeleteDocEventListener = Order.on('delete', this.handlerChangeOrder)

  await this.setSeries()
}
   */
  async componentDidMount () {
    const { Order } = this.foundation.data

    // listen to add, edit and delete events on Order collection
    // and react to it
    /**
     * listen to add Order Data Entity change event on Data API
     */
    this.onAddDocEventListener = Order.on('add', this.handlerChangeOrder)

    /**
     * listen to edit Order Data Entity change event on Data API
     */
    this.onEditDocEventListener = Order.on('edit', this.handlerChangeOrder)

    /**
     * listen to delete Order Data Entity change event on Data API
     */
    this.onDeleteDocEventListener = Order.on('delete', this.handlerChangeOrder)

    await this.setSeries()
  }

  render () {
    return (
      <>
        <ResponsiveContainer height={300}>
          <LineChart
            data={this.state.series}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: 24
            }}
          >
            <XAxis dataKey='time' stroke='#cccccc' />
            <YAxis stroke='#cccccc'>
              <Label
                angle={270}
                position='left'
                style={{ textAnchor: 'middle', fill: '#000000' }}
              >
                Sales ($)
              </Label>
            </YAxis>
            <Line
              type='monotone'
              dataKey='amount'
              stroke='#000000'
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </>
    )
  }
}

export default Chart
