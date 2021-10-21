//import theme from './../theme'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import AttachFileIcon from '@material-ui/icons/AttachFile'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {Link} from 'react-router-dom'

const FirstPage = (): JSX.Element => {
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
        Bitcoin Wallet
      </Box>

      <Box
        marginTop="15vh"
        display="flex"
      >
        <StyledLink to="/generate-wallet">
          <Button variant="contained" size="large" endIcon={<AddCircleIcon/>}>
            Create Wallet
          </Button>
        </StyledLink>
        <Box marginLeft="2rem">
          <Button variant="contained" size="large" endIcon={<AttachFileIcon/>}>
            Select existing wallet
          </Button>
        </Box>
      </Box>

    </Box>
  )
}

const StyledLink = styled(Link)`
  text-decoration: none !important;
`

export default FirstPage;
