// src/Views/VistaGerente.jsx

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MovimientosXDia } from "../Charts/MovimientosXDia";
import { SalidasXDia } from "../Charts/SalidasXDia";
import { EntradasXDia } from "../Charts/EntradasXDia";
import { LotesActuales } from "../Charts/LotesActuales";
import { ProductosPorVencer } from "../Charts/ProductosPorVencer";
import { ProductosBajoStockMinimo } from "../Charts/ProductosBajoStockMinimo";
import { Kardex } from "../Components/Kardex";
import NotificationListener from "../Components/NotificationListener";
import { Box, IconButton, Typography, Button, Grid } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { ColorModeContext } from "../contexts/ColorModeContext";

export const VistaGerente = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const colorMode = useContext(ColorModeContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
          {localStorage.getItem("theme") === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>

      <NotificationListener />

      <Typography variant="h4" gutterBottom>
        Vista Gerente
      </Typography>

      <Kardex />

      {/* Usar Grid para organizar los gráficos */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Movimientos totales por día
          </Typography>
          <MovimientosXDia />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Salidas totales por día
          </Typography>
          <SalidasXDia />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Entradas totales por día
          </Typography>
          <EntradasXDia />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Lotes actuales
          </Typography>
          <LotesActuales />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Productos por vencer
          </Typography>
          <ProductosPorVencer />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Productos bajo stock mínimo
          </Typography>
          <ProductosBajoStockMinimo />
        </Grid>
      </Grid>

      {/* Botón para cerrar sesión */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );
};
