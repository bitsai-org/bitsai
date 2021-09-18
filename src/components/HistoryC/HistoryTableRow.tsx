import React from 'react'

import Box from '@material-ui/core/Box'

interface Transaction {
  date: string;
  description: string;
  amount: number;
  status: string;
}

interface Props {
  tx?: Transaction;
}

const HistoryTableRow = (props: Props): JSX.Element => {
  let cols: any;
  const colComponent = props.tx ? 'div' : 'h3';
  if (props.tx) {
    const tx = props.tx
    cols = [tx.date, tx.description, tx.amount, tx.status]
  } else
    cols = ['Date', 'Description', 'Amount', 'Status']
 
  return (
    <>
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        flexDirection="row"
      >
        <Box
          //component="h3"
          component={colComponent}
          width="20%"
        >
          {cols[0]}
       </Box>
        <Box
          component={colComponent}
          width="20%"
        >
          {cols[1]}
        </Box>
        <Box
          component={colComponent}
          width="20%"
        >
          {cols[2]}
        </Box>
        <Box
          component={colComponent}
          width="20%"
        >
          {cols[3]}
        </Box>
      </Box>
    </>
  )
}

export default HistoryTableRow;
