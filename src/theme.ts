import { createTheme } from '@mui/material/styles'
import ReggaeOneRegular from './assets/fonts/ReggaeOne-Regular.ttf'


const palette = {
  // palette values for dark mode
  common: {
    black: '#282828',
    white: '#ebdbb2',
  },
  primary: {
    main: '#fabd2f',
    dark: '#d79921'
  },
  error: {
    main: '#fb4934',
  },
  info: {
    main: '#83a598',
  },
  success: {
    main: '#8ec07c',
    dark: '#689d6a',
  },

  background: {
    default: '#282828',
    paper: '#424242',
  },
  text: {
    primary: '#ebdbb2',
    secondary: '#d79921',
  },
}

const components = {
  MuiCssBaseline: {
    styleOverrides: `
      @font-face {
        font-family: 'ReggaeOne';
        src: local('ReggaeOne'), url(${ReggaeOneRegular}) format('truetype');
      }

      .MuiSwitch-track {
        background-color: #424242 !important;
      }

      .MuiFilledInput-root {
        background-color: #424242 !important;
      }

      .MuiOutlinedInput-root {
        background-color: #424242 !important;
      }

      .MuiAlert-root {
        color: #ebdbb2 !important;
      }
    `
  }
}

const theme = createTheme({
  palette,
  components,
})

export default theme
