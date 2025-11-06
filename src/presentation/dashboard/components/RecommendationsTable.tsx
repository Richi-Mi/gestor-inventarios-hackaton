import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  Typography
} from '@mui/material';

// --- 1. Interfaz para la fila de predicción ---
// (Debe coincidir con la de DashboardScreen.tsx y el JSON)
interface PredictionRow {
  TIENDA: string;
  UNIDAD_DE_NEGOCIO: string;
  MES: string;
  PREDICCION_PZS: number;
  INVENTARIO_SUGERIDO: number;
}

// --- 2. Interfaz para las props del componente ---
interface RecommendationsTableProps {
  data: PredictionRow[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
  fontWeight: 'bold', // Estilo de tu archivo original
}));

// Función para determinar el color/estado basado en la predicción
const getStatusColor = (prediction: number) => {
  if (prediction > 50000) return 'success.light'; // Números altos en verde
  if (prediction < 5000) return 'error.light';   // Números bajos en rojo
  return 'warning.light';                 // Números medios en amarillo
};

// --- 3. El componente ahora acepta props ---
export const RecommendationsTable = ({ data: propData }: RecommendationsTableProps) => {
  
  // --- 4. Manejo de datos vacíos ---
  if (!propData || propData.length === 0) {
    return <Typography sx={{color: 'text.secondary', height: 100, display: 'grid', placeItems: 'center'}}>No hay datos de predicción.</Typography>;
  }

  return (
    // Añadimos maxHeight para permitir scroll si hay muchos datos
    <TableContainer sx={{ maxHeight: 440 }}> 
      <Table stickyHeader> {/* stickyHeader para que el encabezado se quede fijo */}
        <TableHead>
          <TableRow>
            <StyledHeaderCell>Tienda</StyledHeaderCell>
            <StyledHeaderCell>Unidad de Negocio</StyledHeaderCell>
            <StyledHeaderCell>Mes (Pronóstico)</StyledHeaderCell>
            <StyledHeaderCell>Venta Predicha (Pzs)</StyledHeaderCell>
            <StyledHeaderCell>Inventario Sugerido</StyledHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* --- 5. Mapeamos sobre los datos de las props --- */}
          {propData.map((row) => (
            <TableRow
              key={`${row.TIENDA}-${row.UNIDAD_DE_NEGOCIO}-${row.MES}`}
              hover
            >
              <StyledTableCell>{row.TIENDA}</StyledTableCell>
              <StyledTableCell>{row.UNIDAD_DE_NEGOCIO}</StyledTableCell>
              <StyledTableCell>{row.MES}</StyledTableCell>
              <StyledTableCell sx={{ 
                color: getStatusColor(row.PREDICCION_PZS),
                fontWeight: 500 
              }}>
                {row.PREDICCION_PZS.toLocaleString()}
              </StyledTableCell>
              <StyledTableCell sx={{ 
                color: getStatusColor(row.PREDICCION_PZS),
                fontWeight: 500 
              }}>
                {row.INVENTARIO_SUGERIDO.toLocaleString()}
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
