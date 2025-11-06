import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment
} from '@mui/material'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import DescriptionIcon from '@mui/icons-material/Description'
import BusinessIcon from '@mui/icons-material/Business'
import CategoryIcon from '@mui/icons-material/Category'
import QrCodeIcon from '@mui/icons-material/QrCode'
import StraightenIcon from '@mui/icons-material/Straighten'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { useForm } from '../../hooks/useForm';
import { doCreateProduct } from '../../api/logisticAPI';
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

const initialFormState = {
  nombreModelo: '',
  descripcion: '',
  marca: '',
  categoria: '',
  codigoBarras: '',
  talla: '',
  color: '',
  precioVenta: ''
}

export const ProductRegister: React.FC = () => {
  const { nombreModelo, descripcion, marca, categoria, codigoBarras, talla, color, precioVenta, onInputChange, onResetForm } = useForm(initialFormState);

  const theme = useTheme()

  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()

  const validate = () => {
    const e: Record<string, string> = {}
    if (!nombreModelo.trim()) e.nombreModelo = 'Nombre del modelo requerido'
    if (!marca.trim()) e.marca = 'Marca requerida'
    if (!categoria.trim()) e.categoria = 'Categoría requerida'
    if (!codigoBarras.trim()) e.codigoBarras = 'Código de barras requerido'
    if (!talla.trim()) e.talla = 'Talla requerida'
    if (!color.trim()) e.color = 'Color requerido'
    if (!precioVenta || Number.isNaN(Number(precioVenta)) || Number(precioVenta) <= 0) e.precioVenta = 'Precio de venta válido requerido'

    setErrors(e)
    return Object.keys(e).length === 0
  }

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault()
        if (!validate()) return

        const payload = {
            nombreModelo: nombreModelo.trim(),
            descripcion: descripcion?.trim() || null,
            marca: marca.trim(),
            categoria: categoria.trim(),
            // Primer SKU
            codigoBarras: codigoBarras.trim(),
            talla: talla.trim(),
            color: color.trim(),
            precioVenta: Number(precioVenta)
        }

    try {
      const resp = await doCreateProduct(payload)
      // Manejo simple: mostrar mensaje y resetear
      alert(resp.message || 'Producto creado con éxito')
      onResetForm()
      // navegar a listado de productos si aplica
      navigate('/')
    } catch (error) {
      console.error('Error creando producto:', error)
      alert('Ocurrió un error al crear el producto')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Paper sx={{ width: 'min(1100px, 95%)', p: 4, bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Registro de Modelo y SKU inicial
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {/* Columna izquierda: Datos del Modelo */}
            <Box>
              <Stack spacing={2}>
                <TextField
                  label="Nombre del Modelo"
                  name="nombreModelo"
                  value={nombreModelo}
                  onChange={onInputChange}
                  error={!!errors.nombreModelo}
                  helperText={errors.nombreModelo}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
            <DriveFileRenameOutlineIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  label="Descripción"
                  name="descripcion"
                  value={descripcion}
                  onChange={onInputChange}
                  multiline
                  rows={4}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
            <DescriptionIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  label="Marca"
                  name="marca"
                  value={marca}
                  onChange={onInputChange}
                  error={!!errors.marca}
                  helperText={errors.marca}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
            <BusinessIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  label="Categoría"
                  name="categoria"
                  value={categoria}
                  onChange={onInputChange}
                  error={!!errors.categoria}
                  helperText={errors.categoria}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
            <CategoryIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>
            </Box>

            {/* Columna derecha: Datos del SKU */}
            <Box>
              <Stack spacing={2}>
                <TextField
                  label="Código de Barras"
                  name="codigoBarras"
                  value={codigoBarras}
                  onChange={onInputChange}
                  error={!!errors.codigoBarras}
                  helperText={errors.codigoBarras}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
            <QrCodeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  label="Talla"
                  name="talla"
                  value={talla}
                  onChange={onInputChange}
                  error={!!errors.talla}
                  helperText={errors.talla}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
            <StraightenIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  label="Color"
                  name="color"
                  value={color}
                  onChange={onInputChange}
                  error={!!errors.color}
                  helperText={errors.color}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
            <ColorLensIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  label="Precio de Venta"
                  name="precioVenta"
                  value={precioVenta}
                  onChange={onInputChange}
                  error={!!errors.precioVenta}
                  helperText={errors.precioVenta}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
            <AttachMoneyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
            <Button variant="outlined" onClick={() => onResetForm()}>Limpiar</Button>
            <Button type="submit" variant="contained">Crear Modelo</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default ProductRegister
