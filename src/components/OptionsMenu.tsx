import React, {useState} from 'react'
import {useSelector} from 'react-redux'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Box from '@mui/material/Box'

import auth from '../persist/auth'
import walletUtils from '../lib/walletUtils'
import notification from '../lib/notification'
import PasswordPopup from './PasswordPopup'

import IconButton from '@mui/material/IconButton'

import MenuIcon from '@mui/icons-material/Menu'
import LockIcon from '@mui/icons-material/Lock'
import RefreshIcon from '@mui/icons-material/Refresh'
import SpaIcon from '@mui/icons-material/Spa'

const OptionsMenu = (): JSX.Element => {
  const walletIsSyncing = useSelector((state: any): boolean => {
    return state.authSlice.walletIsSyncing
  })

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const handleRefresh = () => {
    if (walletIsSyncing) {
      const msg = 'Wallet is already syncing...'
      console.log(msg)
      notification.setWarning(msg)
    } else
      walletUtils.syncWallet()

    closeMenu()
  }

  const [showPasswordPopup, setShowPasswordPopup] = useState(false)
  const handleShowSeed = () => {
    setShowPasswordPopup(true)

    closeMenu()
  }

  const handleLockWallet = () => {
    auth.deAuthenticate()

    closeMenu()
  }

  return (
    <>
      <PasswordPopup
        open={showPasswordPopup}
        close={()=>{setShowPasswordPopup(false)}}
        after='show-mnemonic-seed'
      />
      <IconButton
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        size="large"
      >
        <MenuIcon color="primary"/>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >

        <MenuItem onClick={handleRefresh}>
          <ListItemIcon>
            <RefreshIcon
              fontSize="medium"
              color="primary"
            />
          </ListItemIcon>
          <Box
            component="p"
            pt="0.25rem"
          >
            Refresh
          </Box>
        </MenuItem>

        <MenuItem onClick={handleShowSeed}>
          <ListItemIcon>
            <SpaIcon
              fontSize="medium"
              color="primary"
            />
          </ListItemIcon>
          <Box
            component="p"
            pt="0.25rem"
          >
            Show Seed
          </Box>
        </MenuItem>

        <MenuItem onClick={handleLockWallet}>
          <ListItemIcon>
            <LockIcon
              fontSize="medium"
              color="primary"
            />
          </ListItemIcon>
          <Box
            component="p"
            pt="0.25rem"
          >
            Lock
          </Box>
        </MenuItem>
      </Menu>
    </>
  )
}

export default OptionsMenu
