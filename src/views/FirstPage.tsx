import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import theme from '../theme'

import Login from '../components/FirstPage/Login'

//import theme from './../theme'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import SpaIcon from '@mui/icons-material/Spa'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'

import persistedData, {EncryptedWallet} from '../persist/data'

import { ReactComponent as LogoSvg} from '../assets/images/owl-only.svg'

const StyledLink = styled(Link)`
  text-decoration: none !important;
`

const FirstPage = (): JSX.Element => {

  const [encryptedWallet, setEncryptedWallet] = useState<string | undefined>(undefined)
  const [encryptedWallets, setEncryptedWallets] = useState<
    Array<EncryptedWallet> | undefined
  >(undefined)

  useEffect(() => {
    const res = persistedData.getEncryptedWallets()
    setEncryptedWallets(res)
    if (res.length > 0)
      setEncryptedWallet(res[0].encryptedWallet)
  }, [])

  const handleWalletName = (walletIndex: number) => {
    setEncryptedWallet(
      encryptedWallets![walletIndex].encryptedWallet
    )
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        mb="2rem"
        color={theme.palette.primary.main}
        display="flex"
        flexDirection="column"
        alignItems="center"

        sx={{
          marginTop: {
            xs: '5vh',
            //sm: '60%',
            md: '10vh',
            //lg: '30%',
          }
        }}
      >
        <LogoSvg
          style={{
            width: '8rem',
          }}
        />
        <Box
          fontSize="3rem"
          sx={{
            fontFamily: 'ReggaeOne',
            userSelect: 'none',
          }}
          textAlign='center'
        >
          BitSai
        </Box>
      </Box>

      <Box
        justifySelf="center"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        sx={{
          width: {
            xs: '80%',
            sm: '60%',
            md: '40%',
            lg: '30%',
          }
        }}
      >
        {encryptedWallet &&
        <Login
          walletName="ado-btc"
          encryptedWallet={encryptedWallet}
          encryptedWallets={encryptedWallets}
          onWalletNameChange={(walletIndex)=>{handleWalletName(walletIndex)}}
        />
        }

        <Box
          mt="2rem"
          display="flex"
          justifyContent="center"
        >
          <StyledLink to="/generate-wallet">
            <Button variant="contained" size="large" endIcon={<AddCircleIcon/>}>
              Create Wallet
            </Button>
          </StyledLink>
          <StyledLink to="/existing-seed"
            style={{
              marginLeft: '2rem',
            }}
          >
            <Button variant="contained" size="large" endIcon={<SpaIcon/>}>
                Existing Seed
            </Button>
          </StyledLink>
        </Box>
      </Box>

    </Box>
  )
}


export default FirstPage
