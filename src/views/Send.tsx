import {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

import Box from '@mui/material/Box'

import SendForm from '../components/Send/SendForm'
import walletUtils, {Wallet, AddressBalance} from '../lib/walletUtils'

const Send = (): JSX.Element => {
  const wallet: Wallet = useSelector((state: any) => {
    return state.walletSlice.wallet
  })

  const [addressesBalances, setAddressesBalances] = useState<Array<AddressBalance>>([])

  useEffect(() => {
    setAddressesBalances(
      walletUtils.getAddressesBalances(wallet.addresses)
    )
  }, [wallet.addresses])

  return (
    <>
      <Box fontSize="2rem" mb="2rem" display="flex" justifyContent="center">
        <h2>
          Send satoshis
        </h2>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          justifySelf="center"
          display="flex"
          justifyContent="center"
          flexDirection="column"
          width="80%"
          //width="50%"
        >
          <SendForm
            addressesBalances={addressesBalances}
          />
        </Box>
      </Box>
    </>
  )
}

export default Send;
