import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Fab
} from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../../api/logisticAPI'
import jsPDF from 'jspdf'

// Tipos

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

type CartItem = {
  productId: string | number
  nombreModelo: string
  cantidad: number
  precioVenta?: number
}

const getTiendaId = () => {
  try {
    const raw = localStorage.getItem('empleado')
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed.tienda ?? parsed.sucursalId ?? null
    }
  } catch {}
  return null
}

const getInventarioLocal = (tiendaId: string | number | null) => {
  if (!tiendaId) return {}
  try {
    const raw = localStorage.getItem(`inventario_${tiendaId}`)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

export const SalesDashboard: React.FC = () => {
  const [user, setUser] = useState<{ nombre?: string; apellido?: string; puesto?: string, tienda?: string } | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [inventoryMap, setInventoryMap] = useState<Record<string | number, number>>({})
  const [cart, setCart] = useState<CartItem[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Leer usuario y tienda
    let tiendaId = null
    try {
      const raw = localStorage.getItem('empleado')
      if (raw) {
        const parsed = JSON.parse(raw)
        setUser({ nombre: parsed.nombre, apellido: parsed.apellido, puesto: parsed.puesto, tienda: parsed.tienda })
        tiendaId = parsed.tienda ?? parsed.sucursalId ?? null
      }
    } catch {}
    // Leer productos
    getProducts().then((data: any) => {
      const list = Array.isArray(data) ? data : (data?.data ?? data?.products ?? [])
      setProducts(list)
      // Leer inventario local
      const localInv = getInventarioLocal(tiendaId)
      const map: Record<string, number> = {}
      list.forEach((p: any) => {
        const id = p.id ?? p.nombreModelo
        map[id] = localInv[id] ?? 0
      })
      setInventoryMap(map)
    })
  }, [])

  const renderSKU = (p: Product) => {
    const s = p.skus
    if (!s) return '-'
    if (Array.isArray(s)) {
      const first = s[0]
      return ` ********* / ${first.talla ?? '-'} / ${first.color ?? '-'} / ${first.precioVenta ?? '-'} `
    }
    return ` ********* / ${s.talla ?? '-'} / ${s.color ?? '-'} / ${s.precioVenta ?? '-'} `
  }

  const handleAddToCart = (p: Product) => {
    const id = p.id ?? p.nombreModelo
    const inv = inventoryMap[id] ?? 0
    if (inv <= 0) return // No hay inventario
    setCart((prev) => {
      const idx = prev.findIndex(item => item.productId === id)
      if (idx >= 0) {
        // Ya está en el carrito, sumar cantidad si hay inventario
        if (prev[idx].cantidad < inv) {
          const updated = [...prev]
          updated[idx].cantidad += 1
          return updated
        }
        return prev // No sumar si excede inventario
      }
      // Nuevo item
      const precioVenta = Array.isArray(p.skus) ? p.skus[0]?.precioVenta : p.skus?.precioVenta
      return [...prev, { productId: id, nombreModelo: p.nombreModelo, cantidad: 1, precioVenta }]
    })
  }

  const handleRemoveFromCart = (id: string | number) => {
    setCart((prev) => prev.filter(item => item.productId !== id))
  }

  const handleRealizarVenta = () => {
    // Actualizar inventario local
    let tiendaId = null
    let empleado = null
    try {
      const raw = localStorage.getItem('empleado')
      if (raw) {
        const parsed = JSON.parse(raw)
        tiendaId = parsed.tienda ?? parsed.sucursalId ?? null
        empleado = parsed
      }
    } catch {}
    if (tiendaId) {
      // Leer inventario actual
      let localInv: Record<string, number> = {}
      try {
        const rawInv = localStorage.getItem(`inventario_${tiendaId}`)
        if (rawInv) localInv = JSON.parse(rawInv)
      } catch {}
      // Descontar cantidades del carrito
      cart.forEach(item => {
        const prev = localInv[item.productId] ?? 0
        localInv[item.productId] = Math.max(0, prev - item.cantidad)
      })
      localStorage.setItem(`inventario_${tiendaId}`, JSON.stringify(localInv))
      setInventoryMap(localInv)
    }

    // Generar PDF recibo
    if (cart.length > 0) {
      const doc = new jsPDF()
      const fecha = new Date().toLocaleString()
      doc.setFontSize(16)
      doc.text('Recibo de venta', 15, 20)
      doc.setFontSize(10)
      doc.text(`Fecha: ${fecha}`, 15, 30)
      doc.text(`Empleado: ${empleado?.nombre ?? ''} ${empleado?.apellido ?? ''}`, 15, 36)
      doc.text(`Tienda: ${empleado?.tienda ?? tiendaId ?? ''}`, 15, 42)
      doc.text('----------------------------------------', 15, 48)
      doc.text('Productos vendidos:', 15, 54)
      let y = 60
      cart.forEach((item, idx) => {
        doc.text(
          `${idx + 1}. ${item.nombreModelo} | Cantidad: ${item.cantidad}${item.precioVenta ? ` | $${item.precioVenta}` : ''}`,
          15,
          y
        )
        y += 8
      })
      doc.text('----------------------------------------', 15, y)
      y += 8
      const total = cart.reduce((acc, item) => acc + (item.precioVenta ? item.precioVenta * item.cantidad : 0), 0)
      doc.text(`Total: $${total.toFixed(2)}`, 15, y)
      doc.save(`recibo_venta_${fecha.replace(/\W+/g, '_')}.pdf`)
    }

    setCart([])
    setDrawerOpen(false)
    alert('Venta realizada')
  }

  return (
    <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
      {/* Main content */}
      <Box sx={{ flex: 1 }}>
        <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" component="h1">Ventas en tienda {user?.tienda}</Typography>
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
              <Button variant="contained" startIcon={<ShoppingCartIcon />} onClick={() => setDrawerOpen(true)}>
                Ver carrito
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 2 }} elevation={1}>
          {products.length === 0 ? (
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
                    <TableCell align="center">Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((p: any) => {
                    const id = p.id ?? p.nombreModelo
                    const inv = inventoryMap[id] ?? 0
                    return (
                      <TableRow key={id} hover>
                        <TableCell>{p.nombreModelo}</TableCell>
                        <TableCell>{p.marca}</TableCell>
                        <TableCell>{p.categoria}</TableCell>
                        <TableCell>{renderSKU(p)}</TableCell>
                        <TableCell align="center">{inv}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="info"
                            onClick={() => handleAddToCart(p)}
                            disabled={inv <= 0 || (cart.find(item => item.productId === id)?.cantidad ?? 0) >= inv}
                            aria-label="añadir"
                          >
                            <AddShoppingCartIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Aside: Carrito de compras */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 340, p: 2 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Carrito de compras
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {cart.length === 0 ? (
            <Typography color="text.secondary">El carrito está vacío.</Typography>
          ) : (
            <List>
              {cart.map(item => (
                <ListItem key={item.productId} secondaryAction={
                  <Button color="error" size="small" onClick={() => handleRemoveFromCart(item.productId)}>
                    Quitar
                  </Button>
                }>
                  <ListItemText
                    primary={item.nombreModelo}
                    secondary={`Cantidad: ${item.cantidad}${item.precioVenta ? ` | $${item.precioVenta}` : ''}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Button
            variant="contained"
            color="info"
            fullWidth
            disabled={cart.length === 0}
            onClick={handleRealizarVenta}
          >
            Realizar venta
          </Button>
        </Box>
      </Drawer>

      {/* Floating button to open cart */}
      <Fab
        color="info"
        size="large"
        aria-label="carrito"
        onClick={() => setDrawerOpen(true)}
        sx={{ position: 'fixed', right: 24, bottom: 24, width: 72, height: 72, boxShadow: 6 }}
      >
        <ShoppingCartIcon fontSize="large" />
      </Fab>
    </Box>
  )
}

export default SalesDashboard
