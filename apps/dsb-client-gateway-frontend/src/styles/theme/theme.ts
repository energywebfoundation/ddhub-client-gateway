import { createTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'
// Create a theme instance.

const theme = createTheme({
  palette: {
    primary: {
      main: '#A466FF',
      dark: '#293145'
    },
    secondary: {
      main: '#F6AFAF',
      light: '#FFC9CA',
      dark: '#EC9A9A'
    },
    error: {
      main: '#FD1803'
    },
    warning: {
      main: '#FF5A00'
    },
    success: {
      main: '#2EB67D'
    },
    info: {
      main: '#0B80DF'
    },
    action: {
      hover: '#CC98FF',
      selected: '#A466FF'
    },
    text: {
      primary: '#CED1D5',
      secondary: '#FFFFFF'
    },
    background: {
      default: '#161D31',
      paper: '#293145'
    }
  }
})
export default theme