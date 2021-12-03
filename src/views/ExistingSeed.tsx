import {useState} from 'react'
import styled from '@emotion/styled'
import theme from '../theme'

import auth from '../persist/auth'
import walletUtils from '../lib/walletUtils'

import * as bip39 from 'bip39'
import CryptoJS from 'crypto-js'

import MnemonicInfo from '../components/GenerateWallet/MnemonicInfo'

import CredentialsInputs , {CredentialsInputsType} from '../components/CredentialsInputs'


import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'


const TextField_ = styled(TextField)`
  //color: white !important;
  width: 100%;
`

const ExistingSeed = (): JSX.Element => {

  const [mnemonicSeed, setMnemonicSeed] = useState<string | undefined>(undefined)
  const [inputMnemonicSeed, setInputMnemonicSeed] = useState<string>('')
  const [invalidMnemonicSeed, setInvalidMnemonicSeed] = useState<undefined | boolean>(undefined)

  const [pressedNext, setPressedNext] = useState(false)

  const [credentials, setCredentials] = useState<CredentialsInputsType>({
    walletName: '',
    password: '',
    ok: false,
  })

  const handleMnemonicSeed = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMnemonicSeed(event.target.value)
  }

  const handleCheck = () => {
    const trimmedMnemonicSeed = inputMnemonicSeed.trim().replace(/\s+/g, ' ')
    const mnemonicSeedWords = trimmedMnemonicSeed.split(/\s+/g)
    const language = guessLanguage(mnemonicSeedWords)
    bip39.setDefaultWordlist(language)

    const validMnemonicSeed = bip39.validateMnemonic(trimmedMnemonicSeed)

    setInvalidMnemonicSeed(!validMnemonicSeed)

    if (validMnemonicSeed) {
      setMnemonicSeed(trimmedMnemonicSeed)
    }
  }

  const handleNext = () => {
    setPressedNext(true)
  }

  const handleCredentials = (newCredentials: CredentialsInputsType) => {
    setCredentials(newCredentials)
  }

  const handleStart = () => {
    if (credentials.ok && mnemonicSeed) {
      walletUtils.generateWallet({
        walletName: credentials.walletName,
        password: credentials.password,
      }, mnemonicSeed)
      window.location.href = '/#/'
    }
  }

  return (
    <>
      <Box
        fontSize="2rem"
        display="flex"
        justifyContent="center"
        color={theme.palette.primary.main}
        mb="1rem"
      >
        <h2>
          Existing Seed
        </h2>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        {!pressedNext &&
          <Box
            justifySelf="center"
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            sx={{
              width: {
                xs: '80%',
                sm: '60%',
                md: '40%',
                lg: '30%',
            }
            }}
          >
            {mnemonicSeed === undefined
              ? [
                <TextField_
                  key="mnemonic-seed-input"
                  label="Mnemonic Seed"
                  maxRows={5}
                  multiline
                  type="text"
                  variant="filled"
                  value={inputMnemonicSeed}
                  onChange={handleMnemonicSeed}

                  error={invalidMnemonicSeed !== undefined && invalidMnemonicSeed}
                  helperText={invalidMnemonicSeed !== undefined && invalidMnemonicSeed
                    ? 'Wrong mnemonic seed format that does not conform to BIP39 and was not generated from BitSai' : ''}
                />,
                <Box mt="1rem" key="check-btn">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCheck}
                  >
                    Check
                  </Button>
                </Box>
              ]
              : [
                <MnemonicInfo
                  key="mnemonic-info"
                  mnemonicSeed={mnemonicSeed}
                />,
                <Box mt="1rem" key="btn-next">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </Box>
              ]
            }
          </Box>
        }
        {pressedNext &&
          <Box
            justifySelf="center"
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            sx={{
              width: {
                xs: '80%',
                sm: '60%',
                md: '40%',
                lg: '30%',
              }
            }}
          >
            <Box
              component="h2"
              color={theme.palette.primary.main}
              mb="1rem"
            >
              Set wallet credentials
            </Box>
            <CredentialsInputs
              onChange={(credentials)=>{handleCredentials(credentials)}}
            />
            <Box mt="2rem" display="flex" justifyContent="center">
              <Button
                disabled={!credentials.ok}
                variant="contained"
                size="large"
                onClick={handleStart}
              >
                Start Bitcoining
              </Button>
            </Box>
          </Box>
        }
      </Box>
    </>
  )
}

const guessLanguage = (mnemonicSeedWords: Array<string>): string => {
  let resLanguage = 'english'
  for (let language in bip39.wordlists) {
    //if (['EN', 'JA'].includes(language))
    //continue
    if (bip39.wordlists[language].includes(mnemonicSeedWords[0])) {
      let ok = true
      for (const word of mnemonicSeedWords) {
        if (! bip39.wordlists[language].includes(word)) {
          ok = false
          break
        }
      }
      if (ok) {
        resLanguage = language
        break
      }
    }
  }
  return resLanguage
}

export default ExistingSeed
