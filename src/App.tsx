import { HashRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom"
import {useEffect} from 'react'
import {useSelector} from 'react-redux'

import styled from 'styled-components'

import Home from './views/Home'
//import
import FirstPage from './views/FirstPage'
import GenerateWallet from './views/GenerateWallet'
import Send from './views/Send'
import Receive from './views/Receive'
import HistoryC from './views/HistoryC'

import Box from '@material-ui/core/Box'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import LockIcon from '@material-ui/icons/Lock'
import IconButton from '@material-ui/core/IconButton'

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
    if (isAuthenticated) {
      walletUtils.syncWallet()
      console.log('Syncing wallet...')
    }
  }, [isAuthenticated])


  return (
    <Box
      //px="10vw"
    >
      <Router>
        <Switch>
          {[
            isAuthenticated  && loggedInRoutes,
            !isAuthenticated && notLogedInRoutes,
          ]}
        </Switch>
      </Router>
    </Box>
  )
}

const notLogedInRoutes = (
  <Box key="unloggedIn">
    <Route exact path="/">
      <FirstPage />
    </Route>
    <Route exact path="/generate-wallet">
      <StyledLink to="/"><IconButton><ArrowBackIcon/></IconButton></StyledLink>
      <GenerateWallet />
    </Route>
    <Redirect to="/"/>
  </Box>
)

const handleLockWallet = () => {
  auth.deAuthenticate()
}
const loggedInRoutes = (
  <Box key="loggedIn">
    <Route exact path="/">
      <Box textAlign="end">
        <IconButton onClick={handleLockWallet}>
          <LockIcon/>
        </IconButton>
      </Box>
      <Home />
    </Route>
    <Route exact path="/send">
      <StyledLink to="/"><IconButton><ArrowBackIcon/></IconButton></StyledLink>
      <Send/>
    </Route>
    <Route exact path="/receive">
      <StyledLink to="/"><IconButton><ArrowBackIcon/></IconButton></StyledLink>
      <Receive/>
    </Route>
    <Route exact path="/history">
      <StyledLink to="/"><IconButton><ArrowBackIcon/></IconButton></StyledLink>
      <HistoryC/>
    </Route>
    <Redirect to="/"/>
  </Box>
)

export default App;
