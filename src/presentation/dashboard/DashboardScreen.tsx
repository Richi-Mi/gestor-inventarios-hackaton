import { useState, useEffect } from 'react';
// ¡CORRECCIÓN! 'SelectChangeEvent' se importa ahora como un 'type'
import { Box, Container, Paper, Typography, Select, MenuItem, FormControl, InputLabel, styled, CircularProgress } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material'; // <-- 1. IMPORTADO AQUÍ COMO TIPO
import { KPICard } from './components/KPICard';
import { SalesChart } from './components/SalesChart';
import { InventoryChart } from './components/InventoryChart';
import { ParadoxChart } from './components/ParadoxChart';
import { RecommendationsTable } from './components/RecommendationsTable';

// --- 1. Definición de Tipos para nuestro JSON ---
// (Basado en el dashboard_data.json que creamos)
interface KpiData {
  totalVentasPzs: string;
  totalInventarioPzs: string;
  rotacionInventario: string;
}
interface ChartRow {
  mes?: string;
  ventas?: number;
  tienda?: string;
  inventario?: number;
  categoria?: string;
  TIENDA?: string;
}
interface ParadojaRow {
  TIENDA: string;
  ventas: number;
  inventario: number;
}
interface PredictionRow {
  TIENDA: string;
  UNIDAD_DE_NEGOCIO: string;
  MES: string;
  PREDICCION_PZS: number;
  INVENTARIO_SUGERIDO: number;
}
interface YearData {
  kpis: KpiData;
  estacionalidad: ChartRow[];
  topInventarioTiendas: ChartRow[];
  ventasPorUnidadNegocio: ChartRow[];
  paradojaTiendas: ParadojaRow[];
}
interface DashboardData {
  '2023': YearData;
  '2024': YearData;
  '2025': YearData;
  'prediccion_2025': {
    prediccionDetallada: PredictionRow[];
  };
}
// --- Fin de Tipos ---

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[700]}`,
}));

export const DashboardScreen = () => {
  // --- 2. Estados para manejar los datos y la UI ---
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024'); // Año por defecto

  // --- 3. Cargar los datos del JSON al montar ---
  useEffect(() => {
    fetch('/dashboard_data.json') // Llama al archivo en la carpeta /public
      .then((res) => res.json())
      .then((jsonData: DashboardData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar dashboard_data.json:", err);
        setLoading(false);
      });
  }, []); // El array vacío [] asegura que esto solo se ejecute una vez

  // --- 4. Manejador para el cambio de año ---
  const handleYearChange = (event: SelectChangeEvent) => { // <-- 2. AHORA EL TIPO ES CORRECTO
    setSelectedYear(event.target.value); // <-- 3. CORREGIDO (era 'Wear')
  };

  // --- 5. Lógica de Carga y Error ---
  if (loading) {
    return (
      <Box sx={{ bgcolor: '#121212', minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ bgcolor: '#121212', minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Typography color="error">Error: No se pudieron cargar los datos del dashboard.</Typography>
      </Box>
    );
  }

  // --- 6. Filtrar datos para pasar a los hijos ---
  // @ts-ignore: Damos por hecho que el año seleccionado existe en data
  const currentData: YearData = data[selectedYear];
  const predictionData = data.prediccion_2025.prediccionDetallada;
  // Creamos el array de años para el dropdown
  const years = Object.keys(data).filter(k => k.startsWith('20'));

  return (
    <Box sx={{ bgcolor: '#121212', color: 'grey.200', py: 4, px: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        {/* Header (Ahora es funcional) */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
              Dashboard de Control: Calzando a México
            </Typography>
            <Typography variant="h5" sx={{ color: 'cyan.400' }}>
              Visión del CEO: Salud y Riesgo Operativo
            </Typography>
          </Box>
          <FormControl sx={{ mt: { xs: 2, md: 0 }, minWidth: 150 }}>
            <InputLabel sx={{ color: 'grey.400' }}>Año</InputLabel>
            <Select
              value={selectedYear}
              onChange={handleYearChange} // <-- CONECTADO
              label="Año"
              sx={{ bgcolor: 'grey.800', color: 'white' }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {/* Renombramos '2025' como '2025 (Parcial)' */}
                  {year === '2025' ? '2025 (Parcial)' : year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* KPIs (Ahora son dinámicos) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          <KPICard
            title="Ventas Totales (Pzs)"
            value={currentData.kpis.totalVentasPzs} // <-- DATO DINÁMICO
            change={`Año ${selectedYear}`}
            color="success"
          />
          <KPICard
            title="Inventario Actual (Pzs)"
            value={currentData.kpis.totalInventarioPzs} // <-- DATO DINÁMICO
            change={`Año ${selectedYear}`}
            color="error"
          />
          <KPICard
            title="Rotación de Inventario"
            value={currentData.kpis.rotacionInventario} // <-- DATO DINÁMICO
            change={`Año ${selectedYear}`}
            color="warning"
          />
        </Box>

        {/* Charts (Ahora reciben props) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Estacionalidad de Ventas (Pzs) - {selectedYear}
            </Typography>
            {/* --- INICIO DE LA CORRECCIÓN --- */}
            <Box sx={{ height: 400 }}>
              <SalesChart data={currentData.estacionalidad} />
            </Box>
            {/* --- FIN DE LA CORRECCIÓN --- */}
          </StyledPaper>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Top 5 Tiendas con MÁS Inventario - {selectedYear}
            </Typography>
            {/* --- INICIO DE LA CORRECCIÓN --- */}
            <Box sx={{ height: 400 }}>
              <InventoryChart data={currentData.topInventarioTiendas} />
            </Box>
            {/* --- FIN DE LA CORRECCIÓN --- */}
          </StyledPaper>
        </Box>

        {/* Paradox Chart (Ahora recibe props) */}
        <StyledPaper sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Diagnóstico de Tiendas: La Paradoja (Ventas vs. Inventario) - {selectedYear}
          </Typography>
          <Box sx={{ height: 400 }}>
            <ParadoxChart data={currentData.paradojaTiendas} /> {/* <-- PROPS PASADAS */}
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

        {/* Recommendations (¡Ahora es condicional!) */}
        {selectedYear === '2025' && (
          <StyledPaper>
            <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
              Basado en el histórico, esta es la predicción de demanda y el inventario sugerido para el resto del año.
            </Typography>
            {/* --- INICIO DE LA CORRECCIÓN --- */}
            <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
              <RecommendationsTable data={predictionData} />
            </Box>
            {/* --- FIN DE LA CORRECCIÓN --- */}
          </StyledPaper>
        )}
      </Container>
    </Box>
  );
};
