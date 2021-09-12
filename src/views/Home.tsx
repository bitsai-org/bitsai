//import theme from './../theme'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {Link} from 'react-router-dom'

const Home = (): JSX.Element => {
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
        <HistoryLink to="/history">
          <p>200000 Sats</p>
        </HistoryLink>
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
