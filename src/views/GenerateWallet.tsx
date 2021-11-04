import {useState} from 'react'

import auth from '../persist/auth'
import walletUtils from '../lib/walletUtils'

import * as bip39 from 'bip39'
import CryptoJS from 'crypto-js'

import GenerateWalletForm, {Credentials} from '../components/GenerateWallet/GenerateWalletForm'
import MnemonicInfo from '../components/GenerateWallet/MnemonicInfo'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'


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
      <Box fontSize="2rem" mb="2rem" display="flex" justifyContent="center">
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
          //width="50%"
          width="80%"
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
