import React, {useState, useEffect} from 'react'
import CryptoJS from 'crypto-js'

import auth from '../../persist/auth'
import walletUtils, {Wallet} from '../../lib/walletUtils'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LockOpenIcon from '@mui/icons-material/LockOpen';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


import styled from '@emotion/styled'

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    console.log(event)
    setAnchorEl(null);
  };
  const handleWalletNameMenu = (event: React.FormEvent<HTMLDivElement>) => {
    //console.log(`/////////`)
    //console.log(event)
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
            mb="0.2rem"
            component="h2"
            //fontSize="1.3rem"
          >
            Welcome Back!
          </Box>
          
          <Box>
            <Button
              id="basic-button"
              aria-controls="basic-menu"
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <Box 
                sx={{
                  textTransform: 'none',
                }}
              >
                Dashboard
              </Box>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              onChange={handleWalletNameMenu}
            >
              <MenuItem 
                onClick={handleClose}
                value="DIRABAK!"
              >
                Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Box>
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
