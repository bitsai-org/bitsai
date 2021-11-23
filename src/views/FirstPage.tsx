import {useState, useEffect} from 'react'

import Login from '../components/FirstPage/Login'

//import theme from './../theme'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import EcoIcon from '@material-ui/icons/Eco';

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
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
    <Box
      display="flex"
      //justifyContent="center"
      alignItems="center"
      height="80vh"
      flexDirection="column"
    >
      <Box
        mt="20vh"
        mb="4rem"
        fontSize="5rem"
      >
        Bitcoin Wallet
      </Box>

      {encryptedWallet &&
      <Login
        walletName="ado-btc"
        encryptedWallet={encryptedWallet}
      />
      }

      <Box
        mt="2rem"
        display="flex"
      >
        <StyledLink to="/generate-wallet">
          <Button variant="contained" size="large" endIcon={<AddCircleIcon/>}>
            Create Wallet
          </Button>
        </StyledLink>
        <Box marginLeft="2rem">
          <StyledLink to="/existing-seed">
            <Button variant="contained" size="large" endIcon={<EcoIcon/>}>
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
