import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from '@emotion/styled'

import OptionsMenu from './OptionsMenu'

import Box from '@mui/material/Box'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import IconButton from '@mui/material/IconButton'

import { ReactComponent as LogoSvg} from '../assets/images/owl-only.svg'
import theme from '../theme'

const StyledLink = styled(Link)`
  text-decoration: none !important;
`

const Navbar = (): JSX.Element => {
  const location = useLocation()

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      {location.pathname === '/'
        ? <Box
          display="flex"
          ml="0.3rem"
          sx={{
            fontFamily: 'ReggaeOne'
          }}
        >
          <LogoSvg
            style={{
              height: '2.25rem'
            }}
          />
          <Box
            component="h2"
            color={theme.palette.primary.main}
            ml="0.2rem"
            style={{
              userSelect: 'none',
            }}
          >
              Bitsai
          </Box>
        </Box>
        : <StyledLink to="/">
          <IconButton color="primary" size="large"><ArrowBackIcon/></IconButton>
        </StyledLink>
      }
      <Box>
        <OptionsMenu/>
      </Box>
    </Box>
  )
}

export default Navbar
