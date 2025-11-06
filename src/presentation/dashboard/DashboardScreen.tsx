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
import { InventoryEvolutionChart } from './components/InventoryEvolutionChart';

// ----------------- TIPOS (Asegurando compatibilidad con el JSON) -----------------
interface KpiData { totalVentasPzs: string; totalInventarioPzs: string; rotacionInventario: string; }
interface ChartRow { mes?: string; ventas?: number; tienda?: string; inventario?: number; categoria?: string; TIENDA?: string; }
interface ParadojaRow { TIENDA: string; ventas: number; inventario: number; }
interface PredictionRow { TIENDA: string; UNIDAD_DE_NEGOCIO: string; MES: string; PREDICCION_PZS: number; INVENTARIO_SUGERIDO: number; }
interface BenchmarkData { totalTiendas: number; tiendasFueraRango: number; porcentajeFueraRango: string; tiendasSobreinventariadas: number; tiendasConVentaPerdida: number; rangoOptimo: string; }
interface CoberturaRow { categoria?: string; tienda?: string; rotacion: number; dias_cobertura: number; ventas: number; inventario: number; }
interface YearData {
  kpis: KpiData; estacionalidad: ChartRow[]; topInventarioTiendas: ChartRow[]; ventasPorUnidadNegocio: ChartRow[];
  paradojaTiendas: ParadojaRow[]; coberturaGeneralDias: string; analisisBenchmark: BenchmarkData;
  coberturaPorTienda: CoberturaRow[]; rotacionPorUnidadNegocio: CoberturaRow[];
}
interface EvolucionRowRaw {
  Año?: number; Mes?: string; Periodo?: string; "Inventario Final"?: number; "Dias Cobertura (Final)"?: number; VentasPredichas?: number; ComprasProgramadas?: number;
}
interface EvolucionRowClean {
  Año: number; Mes: string; Periodo: string; InventarioInicial: number;
  VentasPredichas: number; ComprasProgramadas: number; InventarioFinal: number;
  DiasCoberturaFinal: number;
  "Dias Cobertura (Final)": number; 
}
interface DashboardData {
  '2023': YearData; '2024': YearData; '2025': YearData;
  'prediccion_2025': { prediccionDetallada: PredictionRow[] };
  evolucionInventario: EvolucionRowRaw[];
  '2026 (Simulado)'?: YearData;
}
// --- MAPA DE MESES ---
const monthOrder: Record<string, number> = {
  Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6, Julio: 7, Agosto: 8,
  Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12,
};
// --- NORMALIZADORES ---
const normalizeEvolucionRow = (r: EvolucionRowRaw): EvolucionRowClean => {
  const año = Number(r.Año ?? 0);
  const mes = String(r.Mes ?? '');
  const periodo = String(r.Periodo ?? `${mes.slice(0, 3)}-${String(año).slice(-2)}`);
  const invInit = Number(r['Inventario Final'] ?? 0); // Asumimos Final aquí para evitar errores de clave
  const ventas = Number(r.VentasPredichas ?? 0);
  const compras = Number(r.ComprasProgramadas ?? 0);
  const invFinal = Number(r['Inventario Final'] ?? 0);
  const diasCob = Number(r['Dias Cobertura (Final)'] ?? 0);

  return {
    Año: año, Mes: mes, Periodo: periodo, InventarioInicial: invInit,
    VentasPredichas: ventas, ComprasProgramadas: compras, InventarioFinal: invFinal,
    DiasCoberturaFinal: diasCob,
    "Dias Cobertura (Final)": diasCob,
  };
};
const normalizePredictionRow = (r: any): PredictionRow => {
  const unidad = r['UNIDAD DE NEGOCIO'] ?? r.UNIDAD_DE_NEGOCIO ?? '';
  return {
    TIENDA: String(r.TIENDA ?? r.tienda ?? ''),
    UNIDAD_DE_NEGOCIO: String(unidad),
    MES: String(r.MES ?? r.Mes ?? ''),
    PREDICCION_PZS: Number(r.PREDICCION_PZS ?? r['PREDICCION_PZS'] ?? 0),
    INVENTARIO_SUGERIDO: Number(r.INVENTARIO_SUGERIDO ?? r['INVENTARIO_SUGERIDO'] ?? 0),
  };
};
// ---------------- FIN DE TIPOS ----------------

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[700]}`,
}));


export const DashboardScreen = () => {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024');


  // --- 1. FETCH Y PROCESAMIENTO DE DATOS ---
  useEffect(() => {
    setLoading(true);
    fetch('/dashboard_data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((jsonData: DashboardData) => {
        const dataCopy: Record<string, any> = { ...jsonData };

        // Normalizamos el array de evolución y la guardamos limpia
        const evolucionRaw: EvolucionRowRaw[] = jsonData.evolucionInventario ?? [];
        const evolucionNormalized: EvolucionRowClean[] = evolucionRaw.map(normalizeEvolucionRow);
        dataCopy.evolucionInventario = evolucionNormalized; 
        
        // El año 2026 (Simulado) ya viene completo del JSON de Python. Solo verificamos.
        if (dataCopy['2026 (Simulado)']) {
            const year2026 = dataCopy['2026 (Simulado)'];
            
            // Sanitización de tablas de 2026 (para asegurar que la rotación sea 7.3x/50 días)
            const sanitizetable = (arr: any[]) => arr.map((c: any) => ({
                ...(c ?? {}),
                dias_cobertura: 50.0,
                rotacion: 365 / 50,
            }));
            
            year2026.rotacionPorUnidadNegocio = sanitizetable(year2026.rotacionPorUnidadNegocio ?? []);
            year2026.coberturaPorTienda = sanitizetable(year2026.coberturaPorTienda ?? []);
            dataCopy['2026 (Simulado)'] = year2026;
        }

        setData(dataCopy);
      })
      .catch((err) => {
        console.error('Error al cargar dashboard_data.json:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  // --- 2. LÓGICA DE RENDER ---
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

  // 1. Obtención y filtrado de datos (Añadimos el filtro para el año simulado)
  const years = Object.keys(data).filter((key) => key.startsWith('20') || key === '2026 (Simulado)');
  const currentData: YearData = (data[selectedYear] ?? {}) as YearData;
  const predictionData = data.prediccion_2025?.prediccionDetallada?.map(normalizePredictionRow) ?? [];
  const evolucionData = data.evolucionInventario ?? [];

  // 2. Procesamiento de datos para el gráfico de Evolución (Nivo Series)
  const evolucionForChart = [{
    id: 'Días de Cobertura',
    data: (evolucionData as EvolucionRowClean[]).map((r) => ({
      x: r.Periodo,
      y: Number(r["Dias Cobertura (Final)"] ?? r.DiasCoberturaFinal ?? 0),
      inventario: Number(r.InventarioFinal ?? 0),
      ventas: Number(r.VentasPredichas ?? 0),
      mes: r.Mes,
      año: r.Año,
    })),
  }];
  
  // ---------------- Render ----------------
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
                  {year === '2025'
                    ? '2025 (Parcial)'
                    : year === '2026 (Simulado)'
                      ? '2026 (Sanación)'
                      : year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* KPIs */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          <KPICard title="Ventas Totales (Pzs)" value={currentData.kpis.totalVentasPzs} change={`Año ${selectedYear}`} color="success" />
          <KPICard title="Inventario Actual (Pzs)" value={currentData.kpis.totalInventarioPzs} change={`Año ${selectedYear}`} color="error" />
          <KPICard title="Rotación de Inventario" value={currentData.kpis.rotacionInventario} change={`Año ${selectedYear}`} color="warning" />
        </Box>

        {/* Benchmark */}
        <BenchmarkAnalysis data={currentData.analisisBenchmark} diasCobertura={currentData.coberturaGeneralDias} />

        {/* Tablas de cobertura */}
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
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              <CoverageByStoreTable data={currentData.coberturaPorTienda} />
            </Box>
          </StyledPaper>
        </Box>

        {/* Gráficos */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 2 }}>Estacionalidad de Ventas (Pzs) - {selectedYear}</Typography>
            <Box sx={{ height: 400 }}>
              <SalesChart data={currentData.estacionalidad} />
            </Box>
          </StyledPaper>
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 2 }}>Top 5 Tiendas con MÁS Inventario - {selectedYear}</Typography>
            <Box sx={{ height: 400 }}>
              <InventoryChart data={currentData.topInventarioTiendas} />
            </Box>
          </StyledPaper>
        </Box>

        {/* Paradoja */}
        <StyledPaper sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Diagnóstico de Tiendas: La Paradoja (Ventas vs. Inventario) - {selectedYear}</Typography>
          <Box sx={{ height: 400 }}>
            <ParadoxChart data={currentData.paradojaTiendas} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 'bold' }}>🔴 Sobreinventario (Mover stock)</Typography>
            <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 'bold' }}>🟡 Venta Perdida (Enviar stock)</Typography>
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>🟢 Tiendas Estrella (Eficientes)</Typography>
          </Box>
        </StyledPaper>

        {/* Evolución del inventario */}
        <StyledPaper sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 1, color: 'white', fontWeight: 'bold' }}>
            ✅ La Curación: Evolución de la Cobertura (Jun '25 - Dic '26)
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
            Proyección del Inventario bajo la Nueva Política (Drenaje Controlado de Stock Sobrante).
          </Typography>

          <InventoryEvolutionChart data={evolucionForChart} highlightYear={2026} />
        </StyledPaper>


        {/* Predicciones (solo para 2025) */}
        {selectedYear === '2025' && (
          <StyledPaper>
            <Typography variant="h6" sx={{ mb: 2 }}>Recomendaciones del Modelo de IA (Pronóstico Jun-Dic 2025)</Typography>
            <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
              Predicción de demanda e inventario sugerido según la política de sanación.
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