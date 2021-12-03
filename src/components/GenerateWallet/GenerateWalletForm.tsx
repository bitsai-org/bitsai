import React, {useState, useEffect} from 'react'
import { passwordStrength } from 'check-password-strength'

import CredentialsInputs, {CredentialsInputsType} from '../CredentialsInputs'

//import styled from '@emotion/styled'
import styled from '@emotion/styled'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl';

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

  const [credentials, setCredentials] = useState<CredentialsInputsType>({
    walletName: '',
    password: '',
    ok: false,
  })

  const [mnemonicSeedLanguage, setMnemonicSeedLanguage] = useState('english')

  const handleGenerateSeed = () => {
    const credentialsToSubmit: Credentials = {
      walletName: credentials.walletName,
      password: credentials.password,
    }
    props.onSubmit(
      credentialsToSubmit,
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

  const handleCredentials = (newCredentials: CredentialsInputsType) => {
    setCredentials(newCredentials)
  }

  return (
    <>
      <CredentialsInputs
        onChange={(credentials)=>{handleCredentials(credentials)}}
      />

      <Box mt="1rem">
        <InputLabel>
          Mnemonic seed language
        </InputLabel>
        <Select
          id="mnemonic-select-id"
          label="Mnemonic language"
          value={mnemonicSeedLanguage}
          onChange={handleMnemonicSeedLanguage}
          displayEmpty
          sx={{
            width: '50%'
          }}
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
          disabled={!credentials.ok}
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
