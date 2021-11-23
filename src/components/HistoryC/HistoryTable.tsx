import {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

import {Transaction, Wallet} from '../../lib/walletUtils'

import Box from '@material-ui/core/Box'
import HistoryTableRow from '../../components/HistoryC/HistoryTableRow'

const HistoryTable = (): JSX.Element => {
  const transactions: Array<Transaction> = useSelector((state: any) => {
    return state.walletSlice.wallet.transactions
  })
  const [sortedTransactions, setSortedTransactions] = useState<Array<Transaction>>([])

  useEffect(() => {
    //sort transactions by time of transaction
    let clonedTransactions = [...transactions]
    clonedTransactions.sort((e1, e2) => {
      if (e1.time && e2.time)
        return e2.time - e1.time
      if (e1.time === undefined)
        return -1
      else
        return 1
    })
    setSortedTransactions(clonedTransactions)
  }, [transactions])

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
          sortedTransactions.map((transaction, i) => {
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
