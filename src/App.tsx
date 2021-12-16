import React, {useEffect} from 'react'
import { HashRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {authActions} from './store/store'

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
import IconButton from '@mui/material/IconButton'

import auth from './persist/auth'
import walletUtils from './lib/walletUtils'

import NotificationSnackbar from './components/NotificationSnackbar'

import Navbar from './components/Navbar'

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
        <StyledLink to="/">
          <IconButton size="large"><ArrowBackIcon color="primary"/></IconButton>
        </StyledLink>
        <GenerateWallet />
      </Route>
      <Route exact path="/existing-seed">
        <StyledLink to="/">
          <IconButton size="large"><ArrowBackIcon color="primary"/></IconButton>
        </StyledLink>
        <ExistingSeed/>
      </Route>
      <Redirect to="/"/>
    </Box>
  )
}

const LoggedInRoutes = (): JSX.Element => {
  const dispatch = useDispatch()

  const [visibleNotification, setVisibleNotification] = React.useState(false)
  const [notificationMsg, setNotificationMsg] = React.useState<undefined | string>(undefined)
  const [notificationSeverity, setNotificationSeverity]
  = React.useState<'error' | 'info' | 'warning'>('info')

  const errorStack: Array<string> = useSelector((state: any) => {
    return state.authSlice.errorStack
  })
  const infoMsg : string = useSelector((state: any) => {
    return state.authSlice.infoMsg
  })
  const warningMsg: string = useSelector((state: any) => {
    return state.authSlice.warningMsg
  })

  useEffect(() => {
    if (infoMsg !== undefined) {
      setNotificationSeverity('info')
      setNotificationMsg(infoMsg)
      setVisibleNotification(true)
      dispatch(authActions.clearInfoMsg())
    }
  }, [infoMsg])

  useEffect(() => {
    if (warningMsg !== undefined) {
      setNotificationSeverity('warning')
      setNotificationMsg(warningMsg)
      setVisibleNotification(true)
      dispatch(authActions.clearWarningMsg())
    }
  }, [warningMsg])

  useEffect(() => {
    if (errorStack.length > 0) {
      for (const errorMsg of errorStack) {
        setNotificationSeverity('error')
        setNotificationMsg(errorMsg)
        setVisibleNotification(true)
      }
      dispatch(authActions.cleanErrorStack())
    }
  }, [errorStack])

  const handleCloseNotification = (visibility: boolean) => {
    setVisibleNotification(visibility)
  }

  return (
    <Box key="loggedIn">
      <NotificationSnackbar
        open={visibleNotification}
        onClose={(open)=>{handleCloseNotification(open)}}
        severity={notificationSeverity}
        msg={notificationMsg!}
      />
      <Navbar />

      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/send">
        <Send/>
      </Route>
      <Route exact path="/receive">
        <Receive/>
      </Route>
      <Route exact path="/history">
        <HistoryC/>
      </Route>
      <Redirect to="/"/>
    </Box>
  )
}

export default App
