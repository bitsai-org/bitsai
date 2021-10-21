import React, {useState, useEffect} from 'react'
import { passwordStrength } from 'check-password-strength'
import * as bip39 from 'bip39'

import styled from 'styled-components'

import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import EcoIcon from '@material-ui/icons/Eco';

const TextField_ = styled(TextField)`
  background-color: white;
  width: 100%;
`

const GenerateWallet = (): JSX.Element => {
  const [walletName, setWalletName] = useState('')
  const [password, setPassword] = useState('')
  const [repeatedPassword, setRepeatedPassword] = useState('')
  const [incorrectPassword, setIncorrectPassword] = useState(false)

  const [passwordStrengthValue, setPasswordStrengthValue] = useState('')

  const [disableGenerateSeed, setDisableGenerateSeed] = useState(true)
  const [disableExistingSeed, setDisableExistingSeed] = useState(true)
  const [disableCredentials, setDisableCredentials] = useState(false)

  const [mnemonicSeed, setMnemonicSeed] = useState<string | undefined>(undefined)

  const handleWalletName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWalletName(event.target.value)
  }
  const handlePassword  = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value
    setPassword(newPassword)
    setPasswordStrengthValue(passwordStrength(newPassword).value)
  }
  const handleRepeatedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRepeatedPassword = event.target.value
    setRepeatedPassword(newRepeatedPassword)
    if (! password.startsWith(newRepeatedPassword))
      setIncorrectPassword(true)
    else
      setIncorrectPassword(false)
  }
  const handleGenerateSeed = () => {
    setDisableExistingSeed(true)
    setDisableCredentials(true)
    setMnemonicSeed(bip39.generateMnemonic())
  }

  const handleExistingSeed = () => {
    setDisableGenerateSeed(true)
    //const mnemonicIsValid = bip39.validateMnemonic(existingMnemonicSeed)
  }

  useEffect(() => {
    if (
      walletName !== ''
      && password !== ''
      && repeatedPassword !== ''
      && password === repeatedPassword
    ) {
      setDisableGenerateSeed(false)
      setDisableExistingSeed(false)
    } else {
      setDisableGenerateSeed(true)
      setDisableExistingSeed(true)
    }
  }, [walletName, password, repeatedPassword])

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
          <Box>
            <TextField_
              disabled={disableCredentials}
              label="Wallet name"
              variant="filled"
              value={walletName}
              onChange={handleWalletName}
            />
          </Box>
          <Box mt="1rem">
            <TextField_
              disabled={disableCredentials}
              label="Password"
              variant="filled"
              type="password"
              value={password}
              onChange={handlePassword}
            />
            <Box component="p">
              {passwordStrengthValue}
            </Box>
          </Box>
          <Box mt="1rem">
            <TextField_
              disabled={disableCredentials}
              label="Repeat password"
              variant="filled"
              type="password"
              value={repeatedPassword}
              onChange={handleRepeatedPassword}

              helperText={incorrectPassword ? 'Incorrect entry.' : ''}
              error={incorrectPassword}
            />
          </Box>

          <Box mt="2rem" display="flex" justifyContent="center">
            <Button 
              disabled={disableGenerateSeed}
              variant="contained" 
              size="large"
              onClick={handleGenerateSeed}
            >
              Generate Seed
            </Button>
            <Box ml="1rem">
              <Button 
                disabled={disableExistingSeed}
                variant="contained" 
                size="large"
                //onClick={}
              >
                Existing seed
              </Button>
            </Box>
          </Box>
          {mnemonicSeed &&
          <Box mt="2rem">
            <Box 
              mb="0.2rem"
              display="flex"
              alignItems="center"
            >
              <EcoIcon/>
              <i>Recovery Seed phrase</i>
            </Box>
            <Box>
              <Box 
                border={2} 
                borderRadius={8}
                //borderColor="#ebc19c"
                p="1rem"
                flex
              >
                <h2>
                  {mnemonicSeed}
                </h2>
              </Box>
            </Box>
            <Box 
              fontSize="1.3rem"
              mt="2rem"
            >
              <p>
                Please save these 12 words on paper (order is important).
                This seed will allow you to recover your wallet in case of
                computer failure.
              </p>
              <Box 
                component="h4"
                mt="1rem"
              >
                WARNING:
              </Box>
              <Box 
                component="ul"
                mt="0.3rem"
                pl="2.5rem"
              >
                <li>Never disclose your seed.</li>
                <li>Never type it on a website.</li>
                <li>Do not store it electronically.</li>
              </Box>
            </Box>
          </Box>
          }

        </Box>
      </Box>
    </>
  )
}

export default GenerateWallet;
