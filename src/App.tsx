import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom"
import styled from 'styled-components'

import Home from './views/Home'
import Send from './views/Send'
import Receive from './views/Receive'
import HistoryC from './views/HistoryC'

import Box from '@material-ui/core/Box'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import IconButton from '@material-ui/core/IconButton'

function App() {
  return (
    <Box
      px="10vw"
    >
      <Router>
        <Switch>
          <Route exact path="/">
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
        </Switch>
      </Router>
    </Box>
  )
}

const StyledLink = styled(Link)`
  text-decoration: none !important;
`

export default App;
