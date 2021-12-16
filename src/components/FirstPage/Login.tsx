import React, {useState} from 'react'

import auth from '../../persist/auth'
import {EncryptedWallet} from '../../persist/data'

import walletUtils  from '../../lib/walletUtils'
import WalletsList from '../Login/WalletsList'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LockOpenIcon from '@mui/icons-material/LockOpen'

interface Props {
  walletName: string,
  encryptedWallet: string,
  encryptedWallets?: Array<EncryptedWallet>,

  onWalletNameChange: (walletIndex: number) => void,
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

  const handleWalletName = (newWalletIndex: number) => {
    props.onWalletNameChange(newWalletIndex)
  }

  return(
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box
          display="flex"
        >
          <Box
            component="h2"
            mr="0.4rem"
          >
            Welcome back,
          </Box>
          <WalletsList
            encryptedWallets={props.encryptedWallets}
            onWalletNameChange={(walletIndex)=>{handleWalletName(walletIndex)}}
          />
        </Box>

        <TextField
          label="Password"
          variant="filled"
          type="password"
          value={password}
          onChange={handlePassword}
          helperText={incorrectPassword ? 'Incorrect password.' : ''}
          error={incorrectPassword}
          style={{
            width: '100%'
          }}
        />
        <Button
          variant="contained"
          size="large"
          endIcon={<LockOpenIcon/>}
          onClick={handleUnlock}
          style={{
            marginTop: '0.2rem',
          }}
        >
          Unlock
        </Button>
      </Box>
      <Box
        component="h2"
        mt="2rem"
        textAlign="center"
      >
        Or ...
      </Box>
    </>
  )
}

export default Login
