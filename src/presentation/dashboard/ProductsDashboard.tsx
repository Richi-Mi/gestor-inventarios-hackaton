import React, { useEffect, useState } from 'react'
import { Avatar, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress, IconButton, TextField, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import SaveIcon from '@mui/icons-material/Save'
import { useNavigate } from 'react-router-dom'
import { getProducts, updateProductInventories } from '../../api/logisticAPI'

type SKU = {
  codigoBarras?: string
  talla?: string
  color?: string
  precioVenta?: number
}

type Product = {
  id?: number | string
  nombreModelo: string
  descripcion?: string | null
  marca: string
  categoria: string
  skus?: SKU | SKU[]
}

export const ProductsDashboard: React.FC = () => {
  const [user, setUser] = useState<{ nombre?: string; apellido?: string; puesto?: string, tienda?: string } | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    // Leer empleado desde localStorage. Suposición: clave 'empleado'. Si no existe, no romper.
    let tiendaId = null
    try {
      const raw = localStorage.getItem('empleado')
      if (raw) {
        const parsed = JSON.parse(raw)
        setUser({ nombre: parsed.nombre, apellido: parsed.apellido, puesto: parsed.puesto, tienda: parsed.tienda })
        tiendaId = parsed.tienda ?? parsed.sucursalId ?? null
      }
    } catch (err) {
      console.warn('No se pudo parsear empleado desde localStorage', err)
    }
    getProducts()
      .then((data: any) => {
        const list = Array.isArray(data) ? data : (data?.data ?? data?.products ?? [])
        setProducts(list)
        // Leer inventario local por tienda
        let localInv: Record<string, number> = {}
        if (tiendaId) {
          const rawInv = localStorage.getItem(`inventario_${tiendaId}`)
          if (rawInv) {
            try {
              localInv = JSON.parse(rawInv)
            } catch {}
          }
        }
        // Inicializar mapa de inventarios: si hay local, usarlo; si no, usar 0
        const map: Record<string, number> = {}
        list.forEach((p: any) => {
          const id = p.id ?? p.nombreModelo
          map[id] = localInv[id] ?? 0
        })
        setInventoryMap(map)
      })
      .catch((err) => {
        console.error('Error fetching products', err)
        setError('Error cargando productos')
      })
      .finally(() => setLoading(false))
  }, [])

  const [inventoryMap, setInventoryMap] = useState<Record<string | number, number>>({})

  const renderSKU = (p: Product) => {    
    const s = p.skus
    if (!s) return '-'
    if (Array.isArray(s)) {
      const first = s[0]
      return ` ********* / ${first.talla ?? '-'} / ${first.color ?? '-'} / ${first.precioVenta ?? '-'} `
    }
    return ` ********* / ${s.talla ?? '-'} / ${s.color ?? '-'} / ${s.precioVenta ?? '-'} `
  }

  const changeInventory = (key: string | number, value: number) => {
    setInventoryMap((prev) => ({ ...prev, [key]: value }))
  }

  const increment = (key: string | number) => {
    changeInventory(key, (Number(inventoryMap[key] ?? 0) || 0) + 1)
  }

  const decrement = (key: string | number) => {
    changeInventory(key, Math.max(0, (Number(inventoryMap[key] ?? 0) || 0) - 1))
  }

  const handleInventoryInput = (key: string | number, val: string) => {
    const n = Number(val)
    if (Number.isNaN(n)) return
    changeInventory(key, Math.max(0, Math.floor(n)))
  }

  const handleSaveInventories = () => {
    // Guardar inventario local por tienda
    let tiendaId = null
    try {
      const raw = localStorage.getItem('empleado')
      if (raw) {
        const parsed = JSON.parse(raw)
        tiendaId = parsed.tienda ?? parsed.sucursalId ?? null
      }
    } catch {}
    if (tiendaId) {
      localStorage.setItem(`inventario_${tiendaId}` , JSON.stringify(inventoryMap))
      alert('Inventario guardado para tienda: ' + tiendaId)
    } else {
      alert('No se pudo identificar la tienda para guardar el inventario')
    }
  }
  

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h1">Gestor de calzado de {user?.tienda} </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#000', color: '#fff' }}>
                  {(user.nombre?.[0] ?? '') + (user.apellido?.[0] ?? '')}
                </Avatar>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{user.nombre} {user.apellido}</Typography>
                  <Typography variant="caption" color="text.secondary">{user.puesto}</Typography>
                </Box>
              </Box>
            ) : null}
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/registerProduct')}>Nuevo calzado</Button>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }} elevation={1}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : products.length === 0 ? (
          <Typography>No se encontraron productos.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre Modelo</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Categoría</TableCell>
                    <TableCell>SKU (Código / Talla / Color / Precio)</TableCell>
                    <TableCell align="center">Inventario</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p: any) => (
                  <TableRow key={p.id ?? p.nombreModelo} hover>
                    <TableCell>{p.nombreModelo}</TableCell>
                    <TableCell>{p.marca}</TableCell>
                    <TableCell>{p.categoria}</TableCell>
                      <TableCell>{renderSKU(p)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <IconButton size="small" onClick={() => decrement(p.id ?? p.nombreModelo)} aria-label="decrement">
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField
                            value={inventoryMap[p.id ?? p.nombreModelo] ?? 0}
                            onChange={(e) => handleInventoryInput(p.id ?? p.nombreModelo, e.target.value)}
                            size="small"
                            inputProps={{ style: { textAlign: 'center', width: 70 } }}
                          />
                          <IconButton size="small" onClick={() => increment(p.id ?? p.nombreModelo)} aria-label="increment">
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
        {/* Floating save button */}
        <Fab
          color="info"
          size="large"
          aria-label="guardar"
          onClick={handleSaveInventories}
          sx={{ position: 'fixed', right: 24, bottom: 24, width: 72, height: 72, boxShadow: 6 }}
        >
          <SaveIcon fontSize="large" />
        </Fab>
    </Box>
  )
}

export default ProductsDashboard
