import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled
} from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.grey[200],
  borderColor: theme.palette.grey[700],
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  color: theme.palette.grey[200],
  borderColor: theme.palette.grey[700],
}));

const data = [
  {
    store: 'Tienda 12',
    unit: 'CALZADO CASUAL MUJER',
    prediction: '55,200',
    action: 'Preparar stock MÁXIMO',
    status: 'success'
  },
  {
    store: 'Tienda 8',
    unit: 'CALZADO NIÑOS',
    prediction: '1,150',
    action: '¡NO ENVIAR! (Riesgo de Sobreinventario)',
    status: 'error'
  },
  {
    store: 'Tienda 16',
    unit: 'CALZADO CASUAL HOMBRE',
    prediction: '18,300',
    action: 'Enviar stock de seguridad',
    status: 'warning'
  }
];

export const RecommendationsTable = () => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <StyledHeaderCell>Tienda</StyledHeaderCell>
            <StyledHeaderCell>Unidad de Negocio</StyledHeaderCell>
            <StyledHeaderCell>Venta Predicha (Pzs)</StyledHeaderCell>
            <StyledHeaderCell>Acción Recomendada</StyledHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.store}
              hover
              sx={{ '&:hover': { backgroundColor: 'grey.800' } }}
            >
              <StyledTableCell>{row.store}</StyledTableCell>
              <StyledTableCell>{row.unit}</StyledTableCell>
              <StyledTableCell sx={{ color: `${row.status}.400` }}>
                {row.prediction}
              </StyledTableCell>
              <StyledTableCell sx={{ color: `${row.status}.400` }}>
                {row.action}
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};