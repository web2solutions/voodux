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

export default function Chart (props) {
  const [series, setSeries] = useState([
    { time: '00:00', amount: 0 },
    { time: '24:00', amount: undefined }
  ])
  const { Order } = props.foundation.data

  const _setSeries = async () => {
    const { data } = await Order.find({})
    if (!data) {
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
    setSeries(final)
  }

  const handlerChangeOrder = async (eventObj) => {
    const { error } = eventObj
    if (error) {
      return
    }
    await _setSeries()
  }

  // listen to add Order Collection event on Data API
  props.foundation.on(
    `collection:add:${props.entity.toLowerCase()}`,
    handlerChangeOrder
  )

  // listen to edit Order Collection event on Data API
  props.foundation.on(
    `collection:edit:${props.entity.toLowerCase()}`,
    handlerChangeOrder
  )

  // listen to delete Order Collection event on Data API
  props.foundation.on(
    `collection:delete:${props.entity.toLowerCase()}`,
    handlerChangeOrder
  )

  useEffect(async () => {
    await _setSeries()
  }, []) // run one time only

  return (
    <>
      <ResponsiveContainer height={300}>
        <LineChart
          data={series}
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
