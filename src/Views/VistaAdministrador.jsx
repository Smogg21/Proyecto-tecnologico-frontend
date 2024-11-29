import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  ListItemIcon,
  ListItemButton, // Import ListItemButton
} from "@mui/material";
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  People as PeopleIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { ColorModeContext } from "../contexts/ColorModeContext";

export const VistaAdministrador = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const colorMode = useContext(ColorModeContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: "Ir a Vista Operador", path: "/vistaOperador", icon: <PeopleIcon /> },
    { text: "Ir a Vista Gerente", path: "/vistaGerente", icon: <SupervisorAccountIcon /> },
    { text: "Ir a Gestión del Sistema", path: "/vistaGestionSistema", icon: <SettingsIcon /> },
  ];

  return (
    <Box>
      {/* AppBar con Drawer */}
      <AppBar position="static">
        <Toolbar>
          {/* Botón para abrir el Drawer */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Título */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Vista Administrador
          </Typography>

          {/* Botón para alternar el modo */}
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
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Contenido principal */}
      <Box p={2}>
        <Typography variant="h4" align="center" gutterBottom>
          {auth.isAuthenticated && auth.user
            ? `Bienvenido, administrador "${auth.user.Usuario}"`
            : "Bienvenido, Administrador"}
        </Typography>
        {/* Puedes agregar más contenido aquí */}
      </Box>
    </Box>
  );
};
