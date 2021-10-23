import React, {useState, useEffect} from 'react'
import CryptoJS from 'crypto-js'

import auth from '../../persist/auth'
import {Wallet} from '../../lib/walletUtils'

import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import LockOpenIcon from '@material-ui/icons/LockOpen';

import styled from 'styled-components'


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
    const hashedPassword = CryptoJS.SHA256(password).toString()
    const res = CryptoJS.AES.decrypt(
      props.encryptedWallet,
      hashedPassword,
    )
    try {
        const wallet: Wallet = JSON.parse(
        res.toString(CryptoJS.enc.Utf8)
      )
      auth.authenticate(wallet, hashedPassword)
    } catch {
      setIncorrectPassword(true)
    }
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
