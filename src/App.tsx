import { HashRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom"
import {useEffect} from 'react'
import {useSelector} from 'react-redux'

import styled from '@emotion/styled'

import Home from './views/Home'
//import
import FirstPage from './views/FirstPage'
import GenerateWallet from './views/GenerateWallet'
import ExistingSeed from './views/ExistingSeed'

import Send from './views/Send'
import Receive from './views/Receive'
import HistoryC from './views/HistoryC'

import Box from '@mui/material/Box'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LockIcon from '@mui/icons-material/Lock'
import IconButton from '@mui/material/IconButton'
import RefreshIcon from '@mui/icons-material/Refresh'

import auth from './persist/auth'
import walletUtils from './lib/walletUtils'

const StyledLink = styled(Link)`
  text-decoration: none !important;
`

const App = (): JSX.Element => {
  const isAuthenticated = useSelector((state: any): boolean => {
    return state.authSlice.isAuthenticated
  })

  useEffect(() => {
    //mutate isAuthenticated globaly
    auth.checkAuthentication()
  }, [])

  useEffect(() => {
    if (isAuthenticated)
      walletUtils.syncWallet()
  }, [isAuthenticated])

  return (
    <Box
      //px="10vw"
    >
      <Router>
        <Switch>
          {isAuthenticated ? <LoggedInRoutes/> : <NotLogedInRoutes/>}
        </Switch>
      </Router>
    </Box>
  )
}


const NotLogedInRoutes = (): JSX.Element => {
  return (
    <Box key="unloggedIn">
      <Route exact path="/">
        <FirstPage />
      </Route>
      <Route exact path="/generate-wallet">
        <StyledLink to="/"><IconButton size="large"><ArrowBackIcon/></IconButton></StyledLink>
        <GenerateWallet />
      </Route>
      <Route exact path="/existing-seed">
        <StyledLink to="/"><IconButton size="large"><ArrowBackIcon/></IconButton></StyledLink>
        <ExistingSeed/>
      </Route>
      <Redirect to="/"/>
    </Box>
  );
}

const handleLockWallet = () => {
  auth.deAuthenticate()
}
const LoggedInRoutes = (): JSX.Element => {
  const walletIsSyncing = useSelector((state: any): boolean => {
    return state.authSlice.walletIsSyncing
  })

  const handleRefresh = () => {
    if (walletIsSyncing)
      console.log('Wallet is already syncing...')
    else
      walletUtils.syncWallet()
  }

  return (
    <Box key="loggedIn">
      <Route exact path="/">
        <Box textAlign="end">
          <IconButton onClick={handleRefresh} size="large">
            <RefreshIcon/>
          </IconButton>
          <IconButton onClick={handleLockWallet} size="large">
            <LockIcon/>
          </IconButton>
        </Box>
        <Home />
      </Route>
      <Route exact path="/send">
        <StyledLink to="/"><IconButton size="large"><ArrowBackIcon/></IconButton></StyledLink>
        <Send/>
      </Route>
      <Route exact path="/receive">
        <StyledLink to="/"><IconButton size="large"><ArrowBackIcon/></IconButton></StyledLink>
        <Receive/>
      </Route>
      <Route exact path="/history">
        <StyledLink to="/"><IconButton size="large"><ArrowBackIcon/></IconButton></StyledLink>
        <HistoryC/>
      </Route>
      <Redirect to="/"/>
    </Box>
  );
}

export default App;
