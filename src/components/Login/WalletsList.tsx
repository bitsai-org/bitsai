import React, {useEffect, useState} from 'react'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'

import theme from '../../theme'
import {EncryptedWallet} from '../../persist/data'

interface Props {
  encryptedWallets?: Array<EncryptedWallet>,
  onWalletNameChange: (walletIndex: number) => void,
}

const WalletsList = (props: Props): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [options, setOptions] = useState<Array<EncryptedWallet>>([])
  const open = Boolean(anchorEl)
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  useEffect(()=>{
    if (props.encryptedWallets !== undefined)
      setOptions(props.encryptedWallets)
  }, [props.encryptedWallets])


  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
  ) => {
    setSelectedIndex(index)
    setAnchorEl(null)

    props.onWalletNameChange(index)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      {options.length > 0 &&
        <List
          component="nav"
          aria-label="Device settings"
          style={{
            padding: 0,
            color: theme.palette.primary.main,
          }}
        >
          <ListItem
            button
            id="lock-button"
            aria-haspopup="listbox"
            aria-controls="lock-menu"
            aria-label="when device is locked"
            //aria-expanded={open ? 'true' : undefined}
            onClick={handleClickListItem}
            style={{
              padding: 0,
            }}
          >
            <h2>
              {options[selectedIndex].walletName}
            </h2>
          </ListItem>
        </List>
      }
      {options.length > 0 &&
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          }}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option.walletName}
              //disabled={index === 0}
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, index)}
            >
              {option.walletName}
            </MenuItem>
          ))}
        </Menu>
      }
    </>
  )
}

export default WalletsList
