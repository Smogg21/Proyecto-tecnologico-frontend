
import { useLotes } from "../Hooks/useLotes";
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
} from "@mui/material";

export const VerInventario = () => {
  const { lotes, error } = useLotes();

  if (error) {
    return (
      <Box mt={2} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!lotes) {
    return (
      <Box mt={2} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id Lote</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Cantidad Actual</TableCell>
            <TableCell>Cantidad Inicial</TableCell>
            <TableCell>Fecha de Caducidad</TableCell>
            <TableCell>Fecha de Entrada Inicial</TableCell>
            <TableCell>Usuario</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(lotes) && lotes.length > 0 ? (
            lotes.map((item) => (
              <TableRow key={item.IdLote}
              hover // Activa el efecto hover predeterminado de MUI
                sx={{
                   // Cambia el cursor al pasar por encima
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)', // Color de fondo al hacer hover
                  },
                }}
              >
                <TableCell>{item.IdLote}</TableCell>
                <TableCell>{item.Nombre}</TableCell>
                <TableCell>{item.CantidadActual}</TableCell>
                <TableCell>{item.CantidadInicial}</TableCell>
                <TableCell>
                  {item.FechaCaducidad
                    ? new Date(item.FechaCaducidad).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {new Date(item.FechaEntrada).toLocaleString()}
                </TableCell>
                <TableCell>{item.IdUsuario}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No hay datos disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
