import { createTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
        main: '#33CBCB',
        light: '#5BD6D6',
        dark: '#159393'
    },
    secondary: {
        main: '#A567FF',
        light: '#B0ADDC',
        dark: '#52446F'
    },
    error: {
      main: '#C82E2E',
    },
    warning: {
        main: '#FFA501',
    },
    success: {
        main: '#0FB544',
    },
    info: {
        main: '#C1FFF9',
    },
    background: {
      default: '#181423;'
    },
  },
})

export default theme
