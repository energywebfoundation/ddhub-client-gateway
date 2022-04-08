import { createTheme, ThemeOptions } from '@mui/material/styles';

// Create a theme instance.
const dsbTheme: ThemeOptions = {
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
  },
  typography: {
    fontFamily: 'Rajdhani',
    body1: {
      fontFamily: 'Bw Gradual',
    },
    body2: {
      fontFamily: 'Sequel Sans',
      letterSpacing: '0.4px'
    }
  },
  components: {
    // Name of the component
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Sequel Sans';
          font-style: normal;
          src: url('/fonts/Sequel-Sans.ttf') format('truetype');
        }
        @font-face {
          font-family: 'Bw Gradual';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url('/fonts/BwGradual-Regular.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Bw Gradual';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: url('/fonts/BwGradual-Medium.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Bw Gradual';
          font-style: normal;
          font-display: swap;
          font-weight: bold;
          src: url('/fonts/BwGradual-Bold.woff2') format('woff2');
        }
      `,
    },
    MuiDrawer: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          backgroundColor: '#181423',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          height: '100%'
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          width: '100%'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%'
        }
      }
    }
  },
}

export const theme = createTheme(dsbTheme);
