import React from 'react'
import { useSelector } from 'react-redux'
import { Wallet } from '../lib/walletUtils'
import theme from '../theme'


//import theme from './../theme'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import {Link} from 'react-router-dom'


const Home = (): JSX.Element => {
  const wallet: Wallet = useSelector((state: any) => {
    return state.walletSlice.wallet
  })

  return (
    <Box
      display="flex"
      //justifyContent="center"
      alignItems="center"
      height="80vh"
      flexDirection="column"
    >
      <Box
        marginTop="20vh"
      >
        <Box
          display="flex"
          alignItems="end"
        >
          <HistoryLink
            to="/history"
            style={{
              color: theme.palette.primary.main,
            }}
          >
            {wallet.balance.unconfirmed === 0
              ? <Box
                component="p"
                sx={{
                  fontSize: {
                    //xs: '2.5rem',
                    xs: '15vw',
                    sm: '5rem',
                    //md: '5rem',
                    //lg: '5rem',
                  }
                }}
              >
                {wallet.balance.confirmed}
              </Box>
              : <Box
                component="p"
                sx={{
                  fontSize: {
                    xs: '7.5vw',
                    sm: '3rem',
                  }
                }}
              >
                {wallet.balance.confirmed} + {wallet.balance.unconfirmed}
              </Box>
            }
          </HistoryLink>
          <Box
            ml="0.3rem"
            //mb="1.5rem"
            fontSize="2rem"
            display="flex"
            component="p"
            sx={{
              fontSize: {
                xs: '6vw',
                sm: '2rem',
              },
              marginBottom: {
                xs: '4.5vw',
                sm: '1.5rem',
              }
            }}
          >
            Sats
          </Box>
        </Box>
      </Box>

      <Box
        marginTop="15vh"
        display="flex"
      >
        <StyledLink to="/send">
          <Button variant="contained" size="large">
            SEND
          </Button>
        </StyledLink>
        <Box marginLeft="2rem">
          <StyledLink to="/receive">
            <Button variant="contained" size="large">
              RECEIVE
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
const HistoryLink = styled(Link)`
  text-decoration: none !important;
  color: inherit;
  &:hover {
    color: #351812;
  }
`

export default Home
