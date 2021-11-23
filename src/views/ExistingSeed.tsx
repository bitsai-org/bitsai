import {useState} from 'react'
import styled from 'styled-components'

import auth from '../persist/auth'
import walletUtils from '../lib/walletUtils'

import * as bip39 from 'bip39'
import CryptoJS from 'crypto-js'

import GenerateWalletForm, {Credentials} from '../components/GenerateWallet/GenerateWalletForm'
import MnemonicInfo from '../components/GenerateWallet/MnemonicInfo'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'


const TextField_ = styled(TextField)`
  background-color: white;
  width: 100%;
`

const ExistingSeed = (): JSX.Element => {

  const [mnemonicSeed, setMnemonicSeed] = useState<string | undefined>(undefined)
  const [mnemonicLanguage, setMnemonicLanguage] = useState<string | undefined>(undefined)
  const [inputMnemonicSeed, setInputMnemonicSeed] = useState<string>('')
  const [invalidMnemonicSeed, setInvalidMnemonicSeed] = useState<undefined | boolean>(undefined)

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

  return (
    <>
      <Box fontSize="2rem" mb="2rem" display="flex" justifyContent="center">
        <h2>
          Existing Seed
        </h2>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          justifySelf="center"
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          //width="50%"
          width="80%"
        >

          {mnemonicSeed === undefined
            ? <TextField_
              label="Mnemonic Seed"
              maxRows={5}
              multiline
              type="text"
              variant="filled"
              value={inputMnemonicSeed}
              onChange={handleMnemonicSeed}

              error={invalidMnemonicSeed !== undefined && invalidMnemonicSeed}
              helperText={invalidMnemonicSeed !== undefined && invalidMnemonicSeed
                ? 'Wrong mnemonic seed format that does not conform to bip39 and was not generated fron this wallet' : ''}
            />
            : <MnemonicInfo
              mnemonicSeed={mnemonicSeed}
              language={mnemonicLanguage}
            />
          }

          <Box mt="1rem">
            <Button
              variant="contained"
              size="large"
              onClick={handleCheck}
            >
              Check
            </Button>
          </Box>

        </Box>
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