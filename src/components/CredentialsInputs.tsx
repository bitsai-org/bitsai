import React, {useState, useEffect} from 'react'
import { passwordStrength } from 'check-password-strength'

//import styled from '@emotion/styled'
import styled from '@emotion/styled'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

const TextField_ = styled(TextField)`
  width: 100%;
`

interface CredentialsInputsType {
  walletName: string,
  password:   string,
  ok: boolean,
}

interface Props {
  onChange: (
    credentials: CredentialsInputsType,
  ) => void,
}

const CredentialsInputs = (props: Props): JSX.Element => {
  const [walletName, setWalletName] = useState('')
  const [password, setPassword] = useState('')
  const [repeatedPassword, setRepeatedPassword] = useState('')
  const [incorrectPassword, setIncorrectPassword] = useState(false)
  const [passwordStrengthValue, setPasswordStrengthValue] = useState('')

  const [credentialsOk, setCredentialsOk] = useState(false)


  const handleWalletName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWalletName = event.target.value
    setWalletName(newWalletName)
    props.onChange({
      walletName: newWalletName,
      password: password,
      ok: credentialsOk,
    })
  }
  const handlePassword  = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value
    setPassword(newPassword)
    setPasswordStrengthValue(passwordStrength(newPassword).value)
    props.onChange({
      walletName: walletName,
      password: newPassword,
      ok: credentialsOk,
    })
  }
  const handleRepeatedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRepeatedPassword = event.target.value
    setRepeatedPassword(newRepeatedPassword)
    if (! password.startsWith(newRepeatedPassword))
      setIncorrectPassword(true)
    else
      setIncorrectPassword(false)
  }

  useEffect(() => {
    let newCredentialsOk = false
    if (
      walletName !== ''
      && password !== ''
      && repeatedPassword !== ''
      && password === repeatedPassword
    ) {
      newCredentialsOk = true
    } else {
      newCredentialsOk = false
    }
    setCredentialsOk(newCredentialsOk)
    props.onChange({
      walletName: walletName,
      password: password,
      ok: newCredentialsOk,
    })
  }, [walletName, password, repeatedPassword])

  return (
    <Box
      style={{
        width: '100%',
      }}
    >
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
    </Box>
  )
}

export type {CredentialsInputsType}
export default CredentialsInputs
