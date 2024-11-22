import  { useState, useContext } from "react";
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
} from "@mui/material";
import {
  Menu as MenuIcon,
  Inventory as InventoryIcon,
  MoveUp as MoveUpIcon,
  AddBox as AddBoxIcon,
  ExitToApp as ExitToAppIcon,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { ColorModeContext } from "../contexts/ColorModeContext";

const menuItems = (navigate) => [
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
];

// eslint-disable-next-line react/prop-types
export const OperadorLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const colorMode = useContext(ColorModeContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDrawerState = (open) => () => {
    setDrawerOpen(open);
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
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawerState(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawerState(false)}
          onKeyDown={toggleDrawerState(false)}
        >
          <List>
            {menuItems(navigate).map((item, index) => (
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
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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