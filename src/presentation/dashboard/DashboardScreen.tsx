import { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, Select, MenuItem, FormControl, InputLabel, styled, CircularProgress } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { KPICard } from './components/KPICard';
import { SalesChart } from './components/SalesChart';
import { InventoryChart } from './components/InventoryChart';
import { ParadoxChart } from './components/ParadoxChart';
import { RecommendationsTable } from './components/RecommendationsTable';
import { BenchmarkAnalysis } from './components/BenchmarkAnalysis';
import { CoverageByBUTable } from './components/CoverageByBUTable';
import { CoverageByStoreTable } from './components/CoverageByStoreTable';

// --- 1. Definición de Tipos (¡ACTUALIZADOS!) ---
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

// --- NUEVO: Interfaces para los datos que generamos en Python ---
interface BenchmarkData {
  totalTiendas: number;
  tiendasFueraRango: number;
  porcentajeFueraRango: string;
  tiendasSobreinventariadas: number;
  tiendasConVentaPerdida: number;
  rangoOptimo: string;
}
interface CoberturaRow {
  categoria?: string; // Para UDN
  tienda?: string;    // Para Tienda
  rotacion: number;
  dias_cobertura: number;
  ventas: number;
  inventario: number;
}
// --- FIN NUEVO ---

// --- NUEVO: Interface YearData ACTUALIZADA ---
interface YearData {
  kpis: KpiData;
  estacionalidad: ChartRow[];
  topInventarioTiendas: ChartRow[];
  ventasPorUnidadNegocio: ChartRow[];
  paradojaTiendas: ParadojaRow[];

  // --- Nuevos Datos ---
  coberturaGeneralDias: string;
  analisisBenchmark: BenchmarkData;
  coberturaPorTienda: CoberturaRow[];
  rotacionPorUnidadNegocio: CoberturaRow[];
}
// --- FIN NUEVO ---

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
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    fetch('/dashboard_data.json')
      .then((res) => res.json())
      .then((jsonData: DashboardData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar dashboard_data.json:", err);
        setLoading(false);
      });
  }, []);

  const handleYearChange = (event: SelectChangeEvent) => {
    setSelectedYear(event.target.value);
  };

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

  // @ts-ignore: Damos por hecho que el año seleccionado existe en data
  const currentData: YearData = data[selectedYear];
  const predictionData = data.prediccion_2025.prediccionDetallada;
  const years = Object.keys(data).filter(k => k.startsWith('20'));

  return (
    <Box sx={{ bgcolor: '#121212', color: 'grey.200', py: 4, px: { xs: 2, md: 4 } }}>
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
          <FormControl sx={{ mt: { xs: 2, md: 0 }, minWidth: 150 }}>
            <InputLabel sx={{ color: 'grey.400' }}>Año</InputLabel>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              label="Año"
              sx={{ bgcolor: 'grey.800', color: 'white' }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year === '2025' ? '2025 (Parcial)' : year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* KPIs */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          <KPICard
            title="Ventas Totales (Pzs)"
            value={currentData.kpis.totalVentasPzs}
            change={`Año ${selectedYear}`}
            color="success"
          />
          <KPICard
            title="Inventario Actual (Pzs)"
            value={currentData.kpis.totalInventarioPzs}
            change={`Año ${selectedYear}`}
            color="error"
          />
          <KPICard
            title="Rotación de Inventario"
            value={currentData.kpis.rotacionInventario}
            change={`Año ${selectedYear}`}
            color="warning"
          />
        </Box>

        {/* --- NUEVO: Sección de Benchmark y Días de Cobertura --- */}
        <BenchmarkAnalysis 
          data={currentData.analisisBenchmark}
          diasCobertura={currentData.coberturaGeneralDias}
        />

        {/* --- NUEVO: Sección de Tablas de Cobertura (Entregables) --- */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Cobertura por Unidad de Negocio - {selectedYear}
            </Typography>
            <CoverageByBUTable data={currentData.rotacionPorUnidadNegocio} />
          </StyledPaper>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Cobertura por Tienda - {selectedYear}
            </Typography>
            {/* Usamos un Box para darle scroll a la tabla de tiendas */}
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              <CoverageByStoreTable data={currentData.coberturaPorTienda} />
            </Box>
          </StyledPaper>
        </Box>
        {/* --- FIN NUEVO --- */}


        {/* Charts (Gráficos existentes) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Estacionalidad de Ventas (Pzs) - {selectedYear}
            </Typography>
            <Box sx={{ height: 400 }}>
              <SalesChart data={currentData.estacionalidad} />
            </Box>
          </StyledPaper>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Top 5 Tiendas con MÁS Inventario - {selectedYear}
            </Typography>
            <Box sx={{ height: 400 }}>
              <InventoryChart data={currentData.topInventarioTiendas} />
            </Box>
          </StyledPaper>
        </Box>

        {/* Paradox Chart (Gráfico existente) */}
        <StyledPaper sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Diagnóstico de Tiendas: La Paradoja (Ventas vs. Inventario) - {selectedYear}
          </Typography>
          <Box sx={{ height: 400 }}>
            <ParadoxChart data={currentData.paradojaTiendas} />
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

        {/* Recommendations (Tabla existente) */}
        {selectedYear === '2025' && (
          <StyledPaper>
             <Typography variant="h6" sx={{ mb: 2 }}>
              Recomendaciones del Modelo de IA (Pronóstico Jun-Dic 2025)
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
              Basado en el histórico, esta es la predicción de demanda y el inventario sugerido para el resto del año.
            </Typography>
            <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
              <RecommendationsTable data={predictionData} />
            </Box>
          </StyledPaper>
        )}
      </Container>
    </Box>
  );
};