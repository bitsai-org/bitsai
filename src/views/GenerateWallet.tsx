import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'

import {walletActions} from '../store/store'
import persistedWallet from '../persist/data'
import auth from '../persist/auth'
import walletUtils from '../lib/walletUtils'

import * as bip39 from 'bip39'
import CryptoJS from 'crypto-js'

import Form, {Credentials} from '../components/GenerateWallet/Form'
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
    let encryptedMnemonicSeed
    let hashedPassword
    if (credentials && mnemonicSeed) {
      //hash password and encrypt with it the mnemonic seed
      hashedPassword = CryptoJS.SHA256(credentials.password).toString()
      encryptedMnemonicSeed = CryptoJS.AES.encrypt(
        mnemonicSeed,
        hashedPassword,
      )
    }
    if (credentials && mnemonicSeed && encryptedMnemonicSeed && hashedPassword) {
      const wallet = walletUtils.generateWallet(
        credentials,
        mnemonicSeed,
        encryptedMnemonicSeed.toString(),
      )
      walletUtils.persistWallet(wallet, hashedPassword)
      //authenticate
      auth.authenticate(wallet, hashedPassword)
      //redirect to homepage
      window.location.href = '/#/'
      //window.location.replace('/')
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
          width="50%"
        >

          {!mnemonicSeed &&
          <Form onSubmit={(credentials, mnemonicSeedLanguage, type) => {
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
