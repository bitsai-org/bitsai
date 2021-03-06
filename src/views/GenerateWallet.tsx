import React, {useState} from 'react'
import theme from '../theme'

import walletUtils from '../lib/walletUtils'

import * as bip39 from 'bip39'

import GenerateWalletForm, {Credentials} from '../components/GenerateWallet/GenerateWalletForm'
import MnemonicInfo from '../components/GenerateWallet/MnemonicInfo'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'


const GenerateWallet = (): JSX.Element => {

  const [credentials, setCredentials] = useState<Credentials | undefined>(undefined)
  const [mnemonicSeed, setMnemonicSeed] = useState<string | undefined>(undefined)

  const handleOnSubmit = (
    credentials: Credentials,
    mnemonicSeedLanguage: string,
    type: string,
  ) => {
    bip39.setDefaultWordlist(mnemonicSeedLanguage)
    setCredentials(credentials)
    if (type === 'generate') {
      setMnemonicSeed(bip39.generateMnemonic())
    } else if (type === 'existing') {
      //pass
    }
  }

  const handleStart = () => {
    if (credentials && mnemonicSeed) {
      walletUtils.generateWallet(credentials, mnemonicSeed)
      window.location.href = '/#/'
    }
  }

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
          Generate Wallet
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

          {!mnemonicSeed &&
          <GenerateWalletForm onSubmit={(credentials, mnemonicSeedLanguage, type) => {
            handleOnSubmit(credentials, mnemonicSeedLanguage, type)
          }}
          />
          }

          {mnemonicSeed &&
            <MnemonicInfo mnemonicSeed={mnemonicSeed}/>
          }
        </Box>
        {mnemonicSeed &&
        <Box mt="2rem">
          <Button
            variant="contained"
            size="large"
            onClick={handleStart}
          >
            Start Bitcoining
          </Button>
        </Box>
        }
      </Box>
    </>
  )
}

export default GenerateWallet
