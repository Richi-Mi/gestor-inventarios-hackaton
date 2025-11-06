import { createTheme } from '@mui/material/styles'

// 60-30-10 rule
const PRIMARY = '#FFF5EE' // 60%
const SECONDARY = '#FFDAB9' // 30%
const ACCENT = '#FF1493' // 10%

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PRIMARY,
      contrastText: '#000'
    },
    secondary: {
      main: SECONDARY,
      contrastText: '#000'
    },
    // accent color mapped to 'info'
    info: {
      main: ACCENT,
      contrastText: '#fff'
    },
    background: {
      default: PRIMARY,
      paper: SECONDARY
    },
    text: {
      primary: '#111',
      secondary: '#333'
    },
    // divider color to increase contrast for <hr> and separators
    divider: '#d97a9f'
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: SECONDARY,
          color: '#111'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: SECONDARY,
          color: '#111'
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#d97a9f'
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#111'
        }
      }
    },
    // Outlined inputs (TextField) focus / outline color
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#c77a99'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#b85f86'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: ACCENT,
            boxShadow: `0 0 0 3px ${ACCENT}33`
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: ACCENT
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: ACCENT,
          color: '#fff',
          '&:hover': {
            backgroundColor: '#e10f7a'
          }
        }
      }
    }
  }
})

export default theme
