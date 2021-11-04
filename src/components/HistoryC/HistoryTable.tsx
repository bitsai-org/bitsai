import {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

import {Transaction, Wallet} from '../../lib/walletUtils'

import Box from '@material-ui/core/Box'
import HistoryTableRow from '../../components/HistoryC/HistoryTableRow'

const HistoryTable = (): JSX.Element => {
  const transactions: Array<Transaction> = useSelector((state: any) => {
    return state.walletSlice.wallet.transactions
  })

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
          transactions.map((transaction, i) => {
            return (
              <HistoryTableRow
                transaction={transaction}
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
