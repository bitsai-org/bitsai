import {useState, useEffect} from 'react'
import theme from '../theme'

import Login from '../components/FirstPage/Login'

//import theme from './../theme'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import SpaIcon from '@mui/icons-material/Spa';

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import {Link} from 'react-router-dom'

import persistedWallet from '../persist/data'

const FirstPage = (): JSX.Element => {

  const [encryptedWallet, setEncryptedWallet] = useState<string | undefined>(undefined)

  useEffect(() => {
    const res = persistedWallet.getEncryptedWallet()
    if (res)
      setEncryptedWallet(res)
  }, [])

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        mt="10vh"
        mb="4rem"
        fontSize="5rem"
        color={theme.palette.primary.main}
        sx={{
          marginTop: {
            xs: '10vh',
            //sm: '60%',
            md: '20vh',
            //lg: '30%',
          }
        }}
      >
        BitSai
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

const StyledLink = styled(Link)`
  text-decoration: none !important;
`

export default FirstPage;
