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
  Snackbar,
  Alert,
  Fab
} from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { getProducts, promptProductRecommendation } from '../../api/logisticAPI'
import { CircularProgress } from '@mui/material'
import jsPDF from 'jspdf'


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
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity?: 'success' | 'error' | 'info' | 'warning' }>({ open: false, message: '' })
  const [recLoading, setRecLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<any>(null)
  const [recError, setRecError] = useState<string | null>(null)


  const fetchRecommendation = async () => {
    setRecLoading(true)
    setRecError(null)
    try {
      const resp: any = await promptProductRecommendation()
    
      setRecommendation(resp?.message ?? resp)
    } catch (err: any) {
      console.error('Error fetching recommendation', err)
      setRecError(err?.message ?? 'Error al generar recomendación')
    } finally {
      setRecLoading(false)
    }
  }


  React.useEffect(() => {
    if (products && products.length > 0) fetchRecommendation()
  }, [products])

  useEffect(() => {
  
    let tiendaId = null
    try {
      const raw = localStorage.getItem('empleado')
      if (raw) {
        const parsed = JSON.parse(raw)
        setUser({ nombre: parsed.nombre, apellido: parsed.apellido, puesto: parsed.puesto, tienda: parsed.tienda })
        tiendaId = parsed.tienda ?? parsed.sucursalId ?? null
      }
    } catch {}
  
    getProducts().then((data: any) => {
      const list = Array.isArray(data) ? data : (data?.data ?? data?.products ?? [])
      setProducts(list)
    
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

  
    const exists = cart.find(item => item.productId === id)
    if (exists) {
      setSnackbar({ open: true, message: 'El producto ya está en el carrito. Ajusta la cantidad en el carrito.', severity: 'info' })
      return
    }

    const precioVenta = Array.isArray(p.skus) ? p.skus[0]?.precioVenta : p.skus?.precioVenta
    setCart((prev) => [...prev, { productId: id, nombreModelo: p.nombreModelo, cantidad: 1, precioVenta }])

  
    setInventoryMap((prevInv) => {
      const available = Number(prevInv[id] ?? 0)
      const next = Math.max(0, available - 1)
      return { ...prevInv, [id]: next }
    })
  }

  const handleRemoveFromCart = (id: string | number) => {
  
    const item = cart.find(it => it.productId === id)
    if (item) {
      setInventoryMap((prevInv) => {
        const current = Number(prevInv[id] ?? 0)
        const next = current + item.cantidad
        const nextMap = { ...prevInv, [id]: next }
        return nextMap
      })
    }
    setCart((prev) => prev.filter(item => item.productId !== id))
  }


  const adjustCartQuantity = (productId: string | number, delta: number) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex(it => it.productId === productId)
      if (idx === -1) return prevCart
      const item = prevCart[idx]
      const newQty = item.cantidad + delta
      if (newQty <= 0) {
        setInventoryMap((prevInv) => ({ ...prevInv, [productId]: Number(prevInv[productId] ?? 0) + item.cantidad }))
        return prevCart.filter(it => it.productId !== productId)
      }

      if (delta > 0) {
        const available = Number(inventoryMap[productId] ?? 0)
        if (available <= 0) return prevCart
        setInventoryMap((prevInv) => ({ ...prevInv, [productId]: Math.max(0, Number(prevInv[productId] ?? 0) - 1) }))
      } else if (delta < 0) {
        setInventoryMap((prevInv) => ({ ...prevInv, [productId]: Number(prevInv[productId] ?? 0) + 1 }))
      }

      const updated = [...prevCart]
      updated[idx] = { ...item, cantidad: newQty }
      return updated
    })
  }

  const handleRealizarVenta = () => {
  
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
    
      let localInv: Record<string, number> = {}
      try {
        const rawInv = localStorage.getItem(`inventario_${tiendaId}`)
        if (rawInv) localInv = JSON.parse(rawInv)
      } catch {}
    
      cart.forEach(item => {
        const prev = localInv[item.productId] ?? 0
        localInv[item.productId] = Math.max(0, prev - item.cantidad)
      })
      localStorage.setItem(`inventario_${tiendaId}`, JSON.stringify(localInv))
      setInventoryMap(localInv)
    }

  
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
    setSnackbar({ open: true, message: 'Venta realizada', severity: 'success' })
  }

  return (
    <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
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

                <Paper sx={{ p: 2, mt: 2 }} elevation={1}>
          <Typography variant="h6" sx={{ mb: 1 }}>Recomendaciones IA</Typography>
          {recLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={20} />
              <Typography>Cargando recomendaciones...</Typography>
            </Box>
          ) : recError ? (
            <Box>
              <Typography color="error">{recError}</Typography>
              <Button size="small" onClick={() => fetchRecommendation()}>Reintentar</Button>
            </Box>
          ) : recommendation ? (
            <Box>
                            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {typeof recommendation === 'string' ? recommendation : (recommendation?.explanation ?? recommendation?.message ?? String(recommendation ?? ''))}
              </Typography>
              <Button size="small" sx={{ mt: 1 }} onClick={() => fetchRecommendation()}>Actualizar</Button>
            </Box>
          ) : (
            <Box>
              <Typography color="text.secondary">Aún no hay recomendaciones. Se generarán cuando haya productos cargados.</Typography>
            </Box>
          )}
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

            <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', md: '35%' }, p: 2 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Carrito de compras
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {cart.length === 0 ? (
            <Typography color="text.secondary">El carrito está vacío.</Typography>
          ) : (
            <>
              <List>
                {cart.map(item => (
                  <ListItem key={item.productId} secondaryAction={
                    <Button color="error" size="small" onClick={() => handleRemoveFromCart(item.productId)}>
                      Quitar
                    </Button>
                  }>
                    <ListItemText
                      primary={item.nombreModelo}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Button size="small" variant="outlined" onClick={() => adjustCartQuantity(item.productId, -1)}>-</Button>
                          <Typography>{item.cantidad}</Typography>
                          <Button size="small" variant="outlined" onClick={() => adjustCartQuantity(item.productId, 1)} disabled={(inventoryMap[item.productId] ?? 0) <= 0}>+</Button>
                          {item.precioVenta ? <Typography sx={{ ml: 1 }}>${(item.precioVenta * item.cantidad).toFixed(2)}</Typography> : null}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Subtotal</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  ${cart.reduce((acc, item) => acc + (item.precioVenta ? item.precioVenta * item.cantidad : 0), 0).toFixed(2)}
                </Typography>
              </Box>
            </>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '', severity: undefined })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ open: false, message: '', severity: undefined })} severity={snackbar.severity ?? 'info'} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

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
