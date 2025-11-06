import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './AppRouter.tsx'
import { CssBaseline } from '@mui/material' // <-- 1. IMPORTAR

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CssBaseline />
      <AppRouter />
    </BrowserRouter>
  </StrictMode>,
)