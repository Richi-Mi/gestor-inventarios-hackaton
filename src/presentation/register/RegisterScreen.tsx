import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material'
import { useForm } from '../../hooks/useForm';
import { doRegister, getStores } from '../../api/logisticAPI';

const registerFormState = {
  nombre: '',
  apellido: '',
  tiendaId: '',
  puesto: '',
  usuario: '',
  contrasena: ''
}

type Store = { id: number; nombre: string }

export const EmployeeRegister: React.FC = () => {

  const { nombre, apellido, tiendaId, puesto, usuario, contrasena, onInputChange, onResetForm, formState } = useForm( registerFormState );

  const [stores, setStores] = useState<Store[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  console.log(stores);
  

  useEffect(() => {
    // Reemplazar con la llamada real a la API para obtener tiendas
    getStores().then(setStores).catch(console.error)
  }, [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!nombre.trim()) e.nombre = 'Nombre requerido'
    if (!apellido.trim()) e.apellido = 'Apellido requerido'
    if (!tiendaId) e.tiendaId = 'Tienda requerida'
    if (!puesto.trim()) e.puesto = 'Puesto requerido'
    if (!usuario.trim()) e.usuario = 'Usuario requerido'
    if (!contrasena) e.contrasena = 'Contraseña requerida'
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const payload = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      sucursalId: Number(tiendaId),
      puesto: puesto.trim(),
      usuario: usuario.trim(),
      password: contrasena
    }
    doRegister(payload)
      .then((response) => {
        alert('Empleado registrado exitosamente')
        onResetForm()
      })
      .catch((error) => {
        console.error('Error al registrar empleado:', error)
      })
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: '#f5f5f5' }}>
      <Paper sx={{ width: 480, p: 4 }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Registro de empleado
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              value={nombre}
              name='nombre'
              onChange={ onInputChange }
              error={!!errors.nombre}
              helperText={errors.nombre}
              fullWidth
            />

            <TextField
              label="Apellido"
              value={apellido}
              name='apellido'
              onChange={ onInputChange }
              error={!!errors.apellido}
              helperText={errors.apellido}
              fullWidth
            />

            <FormControl fullWidth error={!!errors.tiendaId}>
              <InputLabel id="tienda-label">Tienda</InputLabel>
              <Select
                labelId="tienda-label"
                value={tiendaId}
                name='tiendaId'
                label="Tienda"
                onChange={ onInputChange}
              >
                {stores.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.nombre}
                  </MenuItem>
                ))}
              </Select>
              {errors.tiendaId ? <Typography color="error" variant="caption">{errors.tiendaId}</Typography> : null}
            </FormControl>

            <TextField
              label='Puesto (ej: "Vendedor Piso", "Gerente")'
              value={puesto}
              name='puesto'
              onChange={ onInputChange}
              error={!!errors.puesto}
              helperText={errors.puesto}
              fullWidth
            />

            <TextField
              label="Usuario"
              value={usuario}
              name='usuario'
              onChange={ onInputChange }
              error={!!errors.usuario}
              helperText={errors.usuario}
              fullWidth
            />

            <TextField
              label="Contraseña"
              type="password"
              name='contrasena'
              value={contrasena}
              onChange={ onInputChange }
              error={!!errors.contrasena}
              helperText={errors.contrasena}
              fullWidth
            />

            <Button type="submit" variant="contained">Registrar empleado</Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}

export default EmployeeRegister