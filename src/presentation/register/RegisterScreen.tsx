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

type Store = { id: number; nombre: string }

export const EmployeeRegister: React.FC = () => {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [tiendaId, setTiendaId] = useState<number | ''>('')
  const [puesto, setPuesto] = useState('')
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [stores, setStores] = useState<Store[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Reemplazar con la llamada real a la API para obtener tiendas
    ;(async () => {
      try {
        const res = await fetch('/api/tiendas') // placeholder
        if (res.ok) {
          const data = await res.json()
          setStores(data)
        } else {
          // fallback / mock
          setStores([
            { id: 1, nombre: 'Tienda Centro' },
            { id: 2, nombre: 'Tienda Norte' }
          ])
        }
      } catch {
        setStores([
          { id: 1, nombre: 'Tienda Centro' },
          { id: 2, nombre: 'Tienda Norte' }
        ])
      }
    })()
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

  const hashPassword = async (pwd: string) => {
    const enc = new TextEncoder()
    const data = enc.encode(pwd)
    const hash = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const contrasenaHash = await hashPassword(contrasena)
    const payload = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      tiendaId: Number(tiendaId),
      puesto: puesto.trim(),
      usuario: usuario.trim(),
      contrasenaHash
    }
    // TODO: enviar payload al backend
    try {
      const res = await fetch('/api/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        // registrar exitoso
        alert('Empleado registrado')
        setNombre('')
        setApellido('')
        setTiendaId('')
        setPuesto('')
        setUsuario('')
        setContrasena('')
        setErrors({})
      } else {
        console.error('Error al registrar empleado', await res.text())
        alert('Error al registrar empleado')
      }
    } catch (err) {
      console.error(err)
      alert('Error de red')
    }
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
              onChange={(ev) => setNombre(ev.target.value)}
              error={!!errors.nombre}
              helperText={errors.nombre}
              fullWidth
            />

            <TextField
              label="Apellido"
              value={apellido}
              onChange={(ev) => setApellido(ev.target.value)}
              error={!!errors.apellido}
              helperText={errors.apellido}
              fullWidth
            />

            <FormControl fullWidth error={!!errors.tiendaId}>
              <InputLabel id="tienda-label">Tienda</InputLabel>
              <Select
                labelId="tienda-label"
                value={tiendaId}
                label="Tienda"
                onChange={(ev) => setTiendaId(ev.target.value as number)}
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
              onChange={(ev) => setPuesto(ev.target.value)}
              error={!!errors.puesto}
              helperText={errors.puesto}
              fullWidth
            />

            <TextField
              label="Usuario"
              value={usuario}
              onChange={(ev) => setUsuario(ev.target.value)}
              error={!!errors.usuario}
              helperText={errors.usuario}
              fullWidth
            />

            <TextField
              label="Contraseña"
              type="password"
              value={contrasena}
              onChange={(ev) => setContrasena(ev.target.value)}
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