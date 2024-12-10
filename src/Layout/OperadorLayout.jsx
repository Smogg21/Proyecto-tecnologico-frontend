/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import NotificationListener from "../Components/NotificationListener";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Inventory as InventoryIcon,
  MoveUp as MoveUpIcon,
  AddBox as AddBoxIcon,
  ExitToApp as ExitToAppIcon,
  Brightness4,
  Brightness7,
  Stop as StopIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { ColorModeContext } from "../contexts/ColorModeContext";
import axios from "axios";
import io from "socket.io-client";

const menuItems = (navigate, stockStopActive, toggleStockStop) => [
  {
    text: "Ver Inventario",
    icon: <InventoryIcon />,
    onClick: () => navigate("/inventario"),
  },
  {
    text: "Ver Movimiento Inventario",
    icon: <MoveUpIcon />,
    onClick: () => navigate("/verMovimientos"),
  },
  {
    text: "Registrar Nuevo Lote",
    icon: <AddBoxIcon />,
    onClick: () => navigate("/nuevoLote"),
  },
  {
    text: "Registrar Movimiento Inventario",
    icon: <AddBoxIcon />,
    onClick: () => navigate("/registrarMovimiento"),
  },
  {
    text: "Registrar Nuevo Producto",
    icon: <AddBoxIcon />,
    onClick: () => navigate("/nuevoProducto"),
  },
  {
    text: stockStopActive ? "Desactivar Parada de stock" : "Activar Parada de stock",
    icon: stockStopActive ? <PlayArrowIcon /> : <StopIcon />,
    onClick: toggleStockStop,
  },
];

// eslint-disable-next-line react/prop-types
export const OperadorLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const colorMode = useContext(ColorModeContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stockStopActive, setStockStopActive] = useState(false);

  // Detectar si la pantalla es pequeña
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const apiUrl = import.meta.env.VITE_API_URL

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDrawerState = (open) => () => {
    setDrawerOpen(open);
  };

  useEffect(() => {
    // Obtener el estado actual de la Parada de stock
    const fetchStockStopStatus = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/stock-stop/status`
        );
        setStockStopActive(response.data.stockStopActive);
      } catch (err) {
        console.error("Error al obtener el estado de la Parada de stock", err);
      }
    };

    fetchStockStopStatus();

    // Configurar Socket.IO para escuchar cambios en el estado
    const socket = io(`${apiUrl}`, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socket.on("stockStopActivated", (data) => {
      setStockStopActive(true);
    });

    socket.on("stockStopDeactivated", (data) => {
      setStockStopActive(false);
    });

    // Limpiar al desmontar el componente
    return () => {
      socket.off("stockStopActivated");
      socket.off("stockStopDeactivated");
      socket.disconnect();
    };
  }, []);


  const toggleStockStop = async () => {
    try {
      if (!stockStopActive) {
        // Activar Parada de stock
        await axios.post(`${apiUrl}/api/stock-stop/activate`);
      } else {
        // Desactivar Parada de stock
        await axios.post(`${apiUrl}/api/stock-stop/deactivate`);
      }
      // El estado se actualizará a través del socket
    } catch (err) {
      console.error('Error al cambiar el estado de la Parada de stock', err);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar>
          {/* Icono para abrir el Drawer */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawerState(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Vista Operador
          </Typography>
          {/* Icono para alternar el modo */}
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {localStorage.getItem("theme") === "dark" ? (
              <Brightness7 />
            ) : (
              <Brightness4 />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawerState(false)}
        variant={isSmallScreen ? "temporary" : "persistent"}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawerState(false)}
          onKeyDown={toggleDrawerState(false)}
        >
          <List>
            {menuItems(navigate, stockStopActive, toggleStockStop).map((item, index) => (
              <ListItem button key={index} onClick={item.onClick}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          width: { xs: "100%", sm: `calc(100% - ${drawerOpen ? 250 : 0}px)` },
          transition: "width 0.3s",
        }}
      >
        {/* Spacer para el AppBar */}
        <Toolbar />
        {/* Listener para obtener notificaciones */}
        <NotificationListener />

        {/* Renderizar el contenido de las vistas */}
        {children}
      </Box>
    </Box>
  );
};
