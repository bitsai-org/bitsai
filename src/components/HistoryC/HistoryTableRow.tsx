import React from 'react'

import {Transaction} from '../../lib/walletUtils'
import Box from '@mui/material/Box'


interface Props {
  transaction?: Transaction;
}

const HistoryTableRow = (props: Props): JSX.Element => {
  let cols: any
  const colComponent = props.transaction ? 'div' : 'h3'
  if (props.transaction) {
    const transaction = props.transaction
    if (transaction.time)
      cols = [
        unixTimestampToDate(transaction.time),
        transaction.type,
        transaction.amount,
        transaction.status,
      ]
    else
      cols = [
        '~~~',
        transaction.type,
        transaction.amount,
        transaction.status,
      ]

  } else
    cols = ['Time', 'Type', 'Amount', 'Status']

  return (
    <>
      <Box
        width="100%"
        pb="0.2rem"
        px="2.5vw"
        display="flex"
        justifyContent="center"
        flexDirection="row"
        sx={{
          fontSize: {
            xs: '3vw',
            sm: '1rem',
          }
        }}
      >
        <Box
          //component="h3"
          component={colComponent}
          width="25%"
        >
          {cols[0]}
        </Box>
        <Box
          component={colComponent}
          width="25%"
        >
          {cols[1]}
        </Box>
        <Box
          component={colComponent}
          width="25%"
        >
          {cols[2]}
        </Box>
        <Box
          component={colComponent}
          width="25%"
        >
          {cols[3]}
        </Box>
      </Box>
    </>
  )
}

const unixTimestampToDate = (unixTimestamp: number): string => {
  const date = new Date(unixTimestamp * 1000)
  //return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  //return date.toISOString().slice(0, 19)
  return date.toLocaleString('en-GB')
}

export default HistoryTableRow
