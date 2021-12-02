import React, {useState, useEffect} from 'react'
import { passwordStrength } from 'check-password-strength'

//import styled from '@emotion/styled'
import styled from '@emotion/styled'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'

const TextField_ = styled(TextField)`
  //background-color: white;
  //background-color: #ebdbb2;
  width: 100%;
`

const Select_ = styled(Select)`
  background-color: white;
  height: 3rem;
  width: 13rem;
  padding-left: 0.7rem;
`

interface Credentials {
  walletName: string,
  password:   string,
}

interface Props {
  onSubmit: (
    credentials: Credentials,
    mnemonicSeedLanguage: string,
    type: string,
  ) => void,
}

const GenerateWalletForm = (props: Props): JSX.Element => {
  const [walletName, setWalletName] = useState('')
  const [password, setPassword] = useState('')
  const [repeatedPassword, setRepeatedPassword] = useState('')
  const [incorrectPassword, setIncorrectPassword] = useState(false)
  const [mnemonicSeedLanguage, setMnemonicSeedLanguage] = useState('english')

  const [passwordStrengthValue, setPasswordStrengthValue] = useState('')

  const [disableSubmitBtns, setDisableSubmitBtns] = useState(true)

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
    const credentials: Credentials = {
      walletName: walletName,
      password: password,
    }
    props.onSubmit(
      credentials,
      mnemonicSeedLanguage,
      'generate',
    )
  }

  const handleMnemonicSeedLanguage = (
    event: SelectChangeEvent
  ) => {
    const newLanguage = event.target.value
    if (typeof newLanguage === 'string')
      setMnemonicSeedLanguage(newLanguage)
  }

  useEffect(() => {
    if (
      walletName !== ''
      && password !== ''
      && repeatedPassword !== ''
      && password === repeatedPassword
    ) {
      setDisableSubmitBtns(false)
    } else {
      setDisableSubmitBtns(true)
    }
  }, [walletName, password, repeatedPassword])

  return (
    <>
      <Box>
        <TextField_
          label="Wallet name"
          variant="filled"
          value={walletName}
          onChange={handleWalletName}
        />
      </Box>
      <Box mt="1rem">
        <TextField_
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
          label="Repeat password"
          variant="filled"
          type="password"
          value={repeatedPassword}
          onChange={handleRepeatedPassword}

          helperText={incorrectPassword ? 'Incorrect entry.' : ''}
          error={incorrectPassword}
        />
      </Box>


      <Box mt="1rem">
        <InputLabel>
          Mnemonic seed language
        </InputLabel>
        <Select
          labelId="demo-simple-select-placeholder-label-label"
          id="demo-simple-select-placeholder-label"
          label="Mnemonic language"
          value={mnemonicSeedLanguage}
          onChange={handleMnemonicSeedLanguage}
          displayEmpty
        >
          <MenuItem value="english">
            English
          </MenuItem>
          <MenuItem value="french">
            French
          </MenuItem>
          <MenuItem value="italian">
            Italian
          </MenuItem>
          <MenuItem value="spanish">
            Spanish
          </MenuItem>
          <MenuItem value="portuguese">
            Portuguese
          </MenuItem>
          <MenuItem value="czech">
            Czech
          </MenuItem>
          <MenuItem value="japanese">
            Japanese
          </MenuItem>
          <MenuItem value="korean">
            Korean
          </MenuItem>
          <MenuItem value="chinese_simplified">
            Simplified Chinese
          </MenuItem>
          <MenuItem value="chinese_traditional">
            Traditional Chinese
          </MenuItem>
        </Select>
      </Box>

      <Box mt="2rem" display="flex" justifyContent="center">
        <Button
          disabled={disableSubmitBtns}
          variant="contained"
          size="large"
          onClick={handleGenerateSeed}
        >
          Generate Seed
        </Button>
      </Box>
    </>
  )
}

export type {Credentials}
export default GenerateWalletForm
