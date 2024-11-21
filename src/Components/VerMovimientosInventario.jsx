import { useMovimientos } from '../Hooks/useMovimientos';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';

export const VerMovimientosInventario = () => {
  const { movimientos, error } = useMovimientos();

  if (error) {
    return (
      <Box mt={2} textAlign="center">
        <Typography color="error" role="alert">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!movimientos) {
    return (
      <Box mt={2} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Movimientos de Inventario">
        <TableHead>
          <TableRow>
            <TableCell>Id Movimiento</TableCell>
            <TableCell>Id Lote</TableCell>
            <TableCell>Producto</TableCell>
            <TableCell>Número de serie</TableCell>
            <TableCell>Tipo Movimiento</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Fecha Movimiento</TableCell>
            <TableCell>Notas</TableCell>
            <TableCell>Id Usuario</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(movimientos) && movimientos.length > 0 ? (
            movimientos.map((item) => (
              <TableRow key={item.IdMovimiento}>
                <TableCell>{item.IdMovimiento}</TableCell>
                <TableCell>{item.IdLote}</TableCell>
                <TableCell>{item.Nombre}</TableCell>
                <TableCell>{item.NumSerie}</TableCell>
                <TableCell>{item.TipoMovimiento}</TableCell>
                <TableCell>{item.Cantidad}</TableCell>
                <TableCell>
                  {new Date(item.FechaMovimiento).toLocaleString()}
                </TableCell>
                <TableCell>{item.Notas || 'N/A'}</TableCell>
                <TableCell>{item.IdUsuario}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center">
                No hay datos disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
