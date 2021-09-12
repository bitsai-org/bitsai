//import theme from './../theme'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'

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
        <A href="/history">
          <p>200000 Sats</p>
        </A>
      </Box>

      <Box
        marginTop="15vh"
        display="flex"
      >
        <Button href="/send" variant="contained" size="large">
          SEND
        </Button>
        <Box marginLeft="2rem">
          <Button href="/receive" variant="contained" size="large">
            RECEIVE
          </Button>
        </Box>
      </Box>

    </Box>
  )
}

const A = styled('a')`
  text-decoration: none !important;
  color: inherit;
  &:hover {
    color: #351812;
  }
`

export default Home;
