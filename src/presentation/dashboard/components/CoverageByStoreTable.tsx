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

interface CoberturaRow {
  tienda?: string;
  categoria?: string;
  rotacion: number;
  dias_cobertura: number;
}

interface Props {
  data: CoberturaRow[];
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[700],
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.grey[200],
    borderColor: theme.palette.grey[700],
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.grey[800],
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const CoverageByStoreTable: React.FC<Props> = ({ data }) => {
  const theme = useTheme();

  const formatDays = (days: number) => {
    let color = theme.palette.text.primary;
    if (days > 90) {
      color = theme.palette.error.light;
    } else if (days < 28) {
      color = theme.palette.warning.light;
    } else {
      color = theme.palette.success.light;
    }

    const displayValue = days >= 9999 ? '999+' : days.toFixed(1);

    return (
      <span style={{ color, fontWeight: 'bold' }}>
        {displayValue} días
      </span>
    );
  };

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', border: `1px solid ${theme.palette.grey[700]}` }}>
      <Table stickyHeader aria-label="cobertura por tienda">
        <TableHead>
          <TableRow>
            <StyledTableCell>Tienda</StyledTableCell>
            <StyledTableCell align="right">Rotación (Veces)</StyledTableCell>
            <StyledTableCell align="right">Cobertura (Días)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.tienda}>
              <StyledTableCell component="th" scope="row">
                {row.tienda}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.rotacion.toFixed(2)}x
              </StyledTableCell>
              <StyledTableCell align="right">
                {formatDays(row.dias_cobertura)}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};