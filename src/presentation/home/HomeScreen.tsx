import React, { useEffect } from 'react';
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [])

  return (
    <>

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

    </>
  );
};

