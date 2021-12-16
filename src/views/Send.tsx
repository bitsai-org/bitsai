import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import theme from '../theme'

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
      <Box
        mb="2rem"
        display="flex"
        justifyContent="center"
        color={theme.palette.primary.main}
        sx={{
          fontSize: {
            xs: '6vw',
            sm: '2rem',
          }
        }}
      >
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
          sx={{
            width: {
              xs: '80%',
              sm: '60%',
              md: '40%',
              lg: '30%',
            }
          }}
        >
          <SendForm
            addressesBalances={addressesBalances}
          />
        </Box>
      </Box>
    </>
  )
}

export default Send
