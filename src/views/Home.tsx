import { useSelector } from 'react-redux'
import { Wallet } from '../lib/walletUtils'
import theme from '../theme'


//import theme from './../theme'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import {Link} from 'react-router-dom'

//import PasswordPopup from '../components/Home/PasswordPopup'

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
        fontSize="5rem"
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
            <Box
              component="p"
            >
              {wallet.balance}
            </Box>
          </HistoryLink>
          <Box
            ml="0.3rem"
            mb="1.5rem"
            fontSize="2rem"
            display="flex"
            component="p"
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

export default Home;
