import { Box, Container, Paper, Typography, Select, MenuItem, FormControl, InputLabel, styled } from '@mui/material';
import { KPICard } from './components/KPICard';
import { SalesChart } from './components/SalesChart';
import { InventoryChart } from './components/InventoryChart';
import { ParadoxChart } from './components/ParadoxChart';
import { RecommendationsTable } from './components/RecommendationsTable';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[800]}`,
}));

export const DashboardScreen = () => {
  const years = ['2025 (Parcial)', '2024', '2023'];

  return (
    <Box sx={{ bgcolor: 'grey.900', color: 'grey.200', py: 4, px: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
              Dashboard de Control: Calzando a México
            </Typography>
            <Typography variant="h5" sx={{ color: 'cyan.400' }}>
              Visión del CEO: Salud y Riesgo Operativo
            </Typography>
          </Box>
          <FormControl sx={{ mt: { xs: 2, md: 0 }, minWidth: 120 }}>
            <InputLabel>Año</InputLabel>
            <Select
              defaultValue="2024"
              label="Año"
              sx={{ bgcolor: 'grey.800', color: 'white' }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* KPIs */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
            <KPICard
              title="Ventas Totales (Pzs)"
              value="5.41 M"
              change="+11.2% vs 2023"
              color="success"
            />
            <KPICard
              title="Inventario Actual (Pzs)"
              value="1.23 M"
              change="Exceso: 24% (¡Riesgo!)"
              color="error"
            />
            <KPICard
              title="Rotación de Inventario"
              value="4.4x"
              change="Objetivo: 6.0x"
              color="warning"
            />
        </Box>

        {/* Charts */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
            <StyledPaper>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Estacionalidad de Ventas (Pzs)
              </Typography>
              <SalesChart />
            </StyledPaper>
            <StyledPaper>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Top 5 Tiendas con MÁS Inventario
              </Typography>
              <InventoryChart />
            </StyledPaper>
        </Box>

        {/* Paradox Chart */}
        <StyledPaper sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Diagnóstico de Tiendas: La Paradoja (Ventas vs. Inventario)
          </Typography>
          <Box sx={{ height: 400 }}>
            <ParadoxChart />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 'bold' }}>
              🔴 Sobreinventario (Mover stock)
            </Typography>
            <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
              🟡 Venta Perdida (Enviar stock)
            </Typography>
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
              🟢 Tiendas Estrella (Eficientes)
            </Typography>
          </Box>
        </StyledPaper>

        {/* Recommendations */}
        <StyledPaper>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recomendaciones del Modelo de IA (Random Forest)
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
            Basado en nuestro análisis, esta es la predicción de demanda para el próximo mes (Dic 2025).
          </Typography>
          <RecommendationsTable />
        </StyledPaper>
      </Container>
    </Box>
  );
};