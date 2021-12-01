import React, {useState, useEffect} from 'react'
import CryptoJS from 'crypto-js'

import auth from '../../persist/auth'
import walletUtils, {Wallet} from '../../lib/walletUtils'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LockOpenIcon from '@mui/icons-material/LockOpen';

import styled from '@emotion/styled'


const TextField_ = styled(TextField)`
  background-color: white;
  width: 20rem;
`
const Button_ = styled(Button)`
  margin-top: 0.2rem;
`

interface Props {
  walletName: string,
  encryptedWallet: string,
}
const Login = (props: Props): JSX.Element => {
  const [password, setPassword] = useState('')
  const [incorrectPassword, setIncorrectPassword] = useState(false)

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    if (incorrectPassword)
      setIncorrectPassword(false)
  }
  const handleUnlock = () => {
    const newWallet = walletUtils.decryptWallet(props.encryptedWallet, password)
    if (newWallet !== undefined)
      auth.authenticate(newWallet)
    else
      setIncorrectPassword(true)
  }

  return(
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box
          mb="0.2rem"
          component="h2"
          //fontSize="1.3rem"
        >
          Welcome Back!
        </Box>
        <TextField_
          label="Password"
          variant="filled"
          type="password"
          value={password}
          onChange={handlePassword}
          helperText={incorrectPassword ? 'Incorrect password.' : ''}
          error={incorrectPassword}
        />
        <Button_
          variant="contained"
          size="large"
          endIcon={<LockOpenIcon/>}
          onClick={handleUnlock}
        >
          Unlock
        </Button_>
      </Box>
      <Box
        component="h2"
        mt="2rem"
      >
        Or ...
      </Box>
    </>
  )
}

export default Login
