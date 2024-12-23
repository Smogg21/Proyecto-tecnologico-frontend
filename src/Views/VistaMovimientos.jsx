import { useNavigate } from "react-router-dom";
import { VerMovimientosInventario } from "../Components/VerMovimientosInventario";
import { Button, Box, Typography } from "@mui/material";
import { OperadorLayout } from "../Layout/OperadorLayout";

export const VistaMovimientos = () => {
  const navigate = useNavigate();

  const regresar = () => {
    navigate("/VistaOperador");
  };

  return (
    <OperadorLayout>
      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: "column", sm: "row" }}
          mb={2}
        >
          <Typography variant="h4">Movimientos de Inventario</Typography>
          <Button variant="contained" color="primary" onClick={regresar}  sx={{ mt: { xs: 2, sm: 0 } }}>
            Regresar
          </Button>
        </Box>
        <VerMovimientosInventario />
      </Box>
    </OperadorLayout>
  );
};
