
import { useNavigate } from "react-router-dom";
import { VerInventario } from "../Components/VerInventario";
import { Button, Box, Typography } from "@mui/material";
import { OperadorLayout } from "../Layout/OperadorLayout";

export const VistaInventario = () => {
  const navigate = useNavigate();

  const regresar = () => {
    navigate("/vistaOperador");
  };

  const toggleColorMode = () => {
    // Implementación de cambio de tema si aplica
  };

  return (
    <OperadorLayout toggleColorMode={toggleColorMode}>
      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4">Inventario</Typography>
          <Button variant="contained" color="primary" onClick={regresar}>
            Regresar
          </Button>
        </Box>
        <VerInventario />
      </Box>
    </OperadorLayout>
  );
};