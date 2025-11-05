import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
} from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// 1. Interfaz para Producto (Tipo de dato)
interface Producto {
  id: number;
  nombre: string;
  precio: string; 
  imagen: string;
}

// 2. Datos tipados
const productos: Producto[] = [
  { id: 1, nombre: 'Runner X', precio: '$89.99', imagen: 'https://via.placeholder.com/300x200?text=Zapato+Deportivo' },
  { id: 2, nombre: 'Casual Chic', precio: '$55.00', imagen: 'https://via.placeholder.com/300x200?text=Zapato+Casual' },
  { id: 3, nombre: 'Bota Trail', precio: '$120.50', imagen: 'https://via.placeholder.com/300x200?text=Bota+Trail' },
];

// 3. Declaración del componente como React.FC
export const HomeScreen: React.FC = () => {
  return (
    <>
      {/* Barra de Navegación (Header) */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <ShoppingCartIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Calzando Mexico.
          </Typography>
          <Button color="inherit">Colección</Button>
          <Button color="inherit">Ofertas</Button>
          <Button color="inherit">
            <ShoppingCartIcon />
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sección Principal (Hero Section) */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Gestor de inventarios para Calzado
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Descubre nuestra nueva colección de zapatillas deportivas, casuales y de aventura. ¡Envío gratis!
          </Typography>
          <Box
            sx={{
              pt: 4,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button variant="contained" size="large" sx={{ mr: 2 }}>
              Ver Colección
            </Button>
            <Button variant="outlined" size="large">
              Conoce Más
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Sección de Productos (Cards) */}
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          {/* Se usa el tipo 'Producto' en el mapeo, lo que es seguro */}
          {productos.map((producto: Producto) => ( 
            <Grid item key={producto.id} xs={12} sm={6} md={4}>
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardMedia
                  component="img"
                  image={producto.imagen}
                  alt={producto.nombre}
                  sx={{ aspectRatio: '3/2' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {producto.nombre}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                    **{producto.precio}**
                  </Typography>
                  <Button variant="contained" size="small" fullWidth>
                    Añadir al Carrito
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

