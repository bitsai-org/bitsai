import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import theme from './theme'

import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import App from './App'
import store from './store/store'
import './index.css'
import reportWebVitals from './reportWebVitals'



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

reportWebVitals()
