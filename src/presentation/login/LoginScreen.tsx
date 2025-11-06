// ...existing code...
import React, { useState } from 'react'
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Link
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Link as LinkD, Route, Routes, useNavigate } from 'react-router-dom'
import { doLogin } from '../../api/logisticAPI'
import { useForm } from '../../hooks/useForm'
import { useTheme } from '@mui/material/styles'

const formLoginState = {
  username: '',
  password: ''
}

export const LoginScreen: React.FC = () => {
  const { username, password, onInputChange, onResetForm} = useForm(formLoginState)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})

  const navigate = useNavigate()
  const theme = useTheme()

  const validate = () => {
    const e: typeof errors = {}
    if (!username.trim()) e.username = 'Usuario requerido'
    if (!password) e.password = 'Contraseña requerida'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    doLogin({
      username,
      password
    }).then((response) => {
      localStorage.setItem('token', response.token)
      localStorage.setItem('empleado', JSON.stringify(response.empleado))

      alert('Login exitoso')
      navigate('/')

    }).catch((error) => {
      console.error('Error en login:', error)
    })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.background.default,
        p: 2,
        color: theme.palette.text.primary
      }}
    >
      <Paper elevation={3} sx={{ width: 380, p: 4, bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'info.main', color: 'info.contrastText', mb: 1 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h6">Iniciar sesión</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            name='username'
            value={username}
            onChange={ onInputChange }
            error={!!errors.username}
            helperText={errors.username}
            autoFocus
          />

          <TextField
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            name='password'
            value={password}
            onChange={ onInputChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="large" color="inherit">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, mb: 3 }}>
            Entrar
          </Button>
        </Box>

        <Button> <LinkD to="/register"> ¿No tienes cuenta? </LinkD> </Button>
      </Paper>
    </Box>
  )
}
// ...existing code...
