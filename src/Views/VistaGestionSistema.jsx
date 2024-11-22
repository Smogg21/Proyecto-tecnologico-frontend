import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Alert,
} from "@mui/material";
import { Menu as MenuIcon, Brightness4, Brightness7, Category, Edit, PersonAdd, ManageAccounts, Password, ArrowBack } from "@mui/icons-material";
import PropTypes from 'prop-types';
import { ColorModeContext } from "../contexts/ColorModeContext";

export const VistaGestionSistema = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mensaje = location.state?.mensaje;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const colorMode = useContext(ColorModeContext);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { 
      text: "Agregar categoría", 
      path: "/nuevaCategoria",
      icon: <Category />
    },
    { 
      text: "Editar categoría", 
      path: "/editarCategoria",
      icon: <Edit />
    },
    { 
      text: "Agregar Usuario", 
      path: "/nuevoUsuario",
      icon: <PersonAdd />
    },
    { 
      text: "Editar Usuario", 
      path: "/editarUsuario",
      icon: <ManageAccounts />
    },
    { 
      text: "Cambiar contraseña a usuario", 
      path: "/nuevaContraseña",
      icon: <Password />
    },
    { 
      text: "Regresar", 
      path: "/vistaAdministrador",
      icon: <ArrowBack />
    },
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
            Gestión del Sistema
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
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
              >
                <IconButton size="small" sx={{ mr: 2 }}>
                  {item.icon}
                </IconButton>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Contenido principal */}
      <Box p={2}>
        {mensaje && (
          <Alert
            severity={mensaje.tipo === "exito" ? "success" : "error"}
            sx={{ mb: 2 }}
          >
            {mensaje.texto}
          </Alert>
        )}

        <Typography variant="h4" align="center" gutterBottom>
          Gestión del Sistema
        </Typography>
      </Box>
    </Box>
  );
};

VistaGestionSistema.propTypes = {
  toggleColorMode: PropTypes.func.isRequired
};
