import { createTheme } from '@mui/material/styles'

// 60-30-10 rule (kept as accent colors)
const PRIMARY = '#FFF5EE' // 60% (used as light accent)
const SECONDARY = '#FFDAB9' // 30% (used as secondary accent)
const ACCENT = '#FF1493' // 10% (strong accent)

// Dark theme palette: background is dark, accents kept as requested
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: PRIMARY,
      contrastText: '#000'
    },
    secondary: {
      main: SECONDARY,
      contrastText: '#000'
    },
    info: {
      main: ACCENT,
      contrastText: '#fff'
    },
    background: {
      default: '#0b1020', // dark background
      paper: '#0f1724' // slightly lighter for cards
    },
    text: {
      primary: '#ffffff',
      secondary: '#cbd5e1'
    },
    divider: '#4b2b3a'
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0f1724',
          color: '#ffffff'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#0f1724',
          color: '#ffffff'
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#4b2b3a'
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#ffffff'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4b2b3a'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: ACCENT
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
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          borderColor: '#4b2b3a'
        },
        head: {
          backgroundColor: '#0b1020',
          color: '#ffffff',
          fontWeight: 600
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#132033'
          }
        }
      }
    }
  }
})

export default theme
