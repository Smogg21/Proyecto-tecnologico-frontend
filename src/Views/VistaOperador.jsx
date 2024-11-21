import  { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import NotificationListener from "../Components/NotificationListener";
import { Button, Grid, Box, Typography } from "@mui/material";

export const VistaOperador = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goToInventory = () => {
    navigate("/inventario");
  };
  const goToNuevoLote = () => {
    navigate("/nuevoLote");
  };
  const goToMovimientoInventario = () => {
    navigate("/registrarMovimiento");
  };
  const goToVerMovimientos = () => {
    navigate("/verMovimientos");
  };

  return (
    <Box p={3}>
      <NotificationListener />

      <Typography variant="h4" align="center" gutterBottom>
        Vista Operador
      </Typography>

      <Grid container spacing={2} justifyContent="center" mb={2}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={goToInventory}>
            Ver Inventario
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={goToVerMovimientos}>
            Ver Movimiento Inventario
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center" mb={2}>
        <Grid item>
          <Button variant="outlined" color="secondary" onClick={goToNuevoLote}>
            Registrar Nuevo Lote
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="secondary" onClick={goToMovimientoInventario}>
            Registrar Movimiento Inventario
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/nuevoProducto")}
          >
            Registrar Nuevo Producto
          </Button>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={2}>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );
};
