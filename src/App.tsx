import Home from './views/Home'
import Send from './views/Send'
import HistoryC from './views/History'
import Receive from './views/Receive'
import Box from '@material-ui/core/Box'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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
            <IconButton href="/"><ArrowBackIcon/></IconButton>
            <Send/>
          </Route>
          <Route exact path="/receive">
            <IconButton href="/"><ArrowBackIcon/></IconButton>
            <Receive/>
          </Route>
          <Route exact path="/history">
            <IconButton href="/"><ArrowBackIcon/></IconButton>
            <HistoryC/>
          </Route>
        </Switch>
      </Router>
    </Box>
  )
}

export default App;
