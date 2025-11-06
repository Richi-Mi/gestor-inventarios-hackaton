import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  tableCellClasses,
  useTheme,
} from '@mui/material';

// --- 1. Definimos las Interfaces de Props ---
// Esta interface debe coincidir con la que definimos en DashboardScreen
interface CoberturaRow {
  categoria?: string;
  rotacion: number;
  dias_cobertura: number;
}

interface Props {
  data: CoberturaRow[];
}

// --- 2. Estilos para la Tabla (para el modo oscuro) ---
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[700], // Fondo de cabecera más oscuro
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.grey[200], // Texto del cuerpo
    borderColor: theme.palette.grey[700], // Borde de celdas
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.grey[800], // Fondo de fila interclado
  },
  // Ocultar el último borde
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const CoverageByBUTable: React.FC<Props> = ({ data }) => {
  const theme = useTheme();

  // --- 3. Función para formatear y colorear los días ---
  const formatDays = (days: number) => {
    let color = theme.palette.text.primary; // Color por defecto (blanco)
    if (days > 90) {
      color = theme.palette.error.light; // Sobreinventario (Rojo)
    } else if (days < 28) {
      color = theme.palette.warning.light; // Venta Perdida (Amarillo)
    } else {
      color = theme.palette.success.light; // Óptimo (Verde)
    }

    // Formateamos el número. Si es 9999 (el que pusimos en Python), mostramos "N/A" o un símbolo
    const displayValue = days >= 9999 ? '999+' : days.toFixed(1);

    return (
      <span style={{ color, fontWeight: 'bold' }}>
        {displayValue} días
      </span>
    );
  };

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', border: `1px solid ${theme.palette.grey[700]}` }}>
      <Table aria-label="cobertura por unidad de negocio">
        <TableHead>
          <TableRow>
            <StyledTableCell>Unidad de Negocio</StyledTableCell>
            <StyledTableCell align="right">Rotación (Veces)</StyledTableCell>
            <StyledTableCell align="right">Cobertura (Días)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.categoria}>
              <StyledTableCell component="th" scope="row">
                {row.categoria}
              </StyledTableCell>
              <StyledTableCell align="right">
                {/* Mostramos la rotación con 2 decimales */}
                {row.rotacion.toFixed(2)}x
              </StyledTableCell>
              <StyledTableCell align="right">
                {/* Usamos la función de formato y color */}
                {formatDays(row.dias_cobertura)}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};