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
import { Box, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

// eslint-disable-next-line react/prop-types
export const VistaGerente = ({ toggleColorMode }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <Box display={"flex"} flexDirection={"column"}>
      {/* Botón para alternar el modo */}
      <Box alignSelf="flex-end">
        <IconButton onClick={toggleColorMode} color="inherit">
          {/* Muestra el icono basado en el tema actual */}
          {localStorage.getItem("theme") === "dark" ? (
            <Brightness7 />
          ) : (
            <Brightness4 />
          )}
        </IconButton>
      </Box>

      <div>
        <NotificationListener />
        <h1>VistaGerente</h1>
        <Kardex />
        <h3>Movimientos totales por día</h3>
        <MovimientosXDia />
        <h3>Salidas totales por día</h3>
        <SalidasXDia />
        <h3>Entradas totales por día</h3>
        <EntradasXDia />
        <h3>Lotes actuales</h3>
        <LotesActuales />
        <h3>Productos por vencer</h3>
        <ProductosPorVencer />
        <h3>Productos bajo stock mínimo</h3>
        <ProductosBajoStockMinimo />

        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </Box>
  );
};
