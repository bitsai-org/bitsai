import React, {useState} from 'react'

import Box from '@material-ui/core/Box'
import HistoryTableRow from '../../components/HistoryC/HistoryTableRow'

interface Transaction {
  date: string;
  description: string;
  amount: number;
  status: string;
}

const HistoryTable = (): JSX.Element => {
  const [transactions, setTransctions] = useState<Transaction[]>(
    [
      {date: '03-10-2017', description: '~', amount: 1000, status: 'Confirmed'},
      {date: '20-09-2019', description: '~', amount: 2000, status: 'Pending'},
      {date: '07-12-2018', description: '~', amount: 5000, status: '2 Blocks'},
      {date: '01-03-2020', description: '~', amount: 6000, status: '3 Blocks'}
    ]
  )

  return (
    <>
      <HistoryTableRow />
      <Box
        mt="0.5rem"
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {
          transactions.map((tx, i) => {
            return (
              <HistoryTableRow 
                tx={tx}
                key={i}
              />
            )
          })
        }
      </Box>
    </>
  )
}

export default HistoryTable;
