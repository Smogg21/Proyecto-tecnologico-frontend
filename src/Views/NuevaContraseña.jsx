// src/Views/NuevaContraseña.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUsuarios } from "../Hooks/useUsuarios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import Select from "react-select";

export const NuevaContraseña = () => {
  const { usuarios, loading } = useUsuarios();
  const navigate = useNavigate();
  const theme = useTheme();

  const opcionesUsuarios = usuarios.map((usuario) => ({
    value: usuario.Usuario,
    label: `${usuario.Usuario} - ${usuario.Nombre} ${usuario.ApellidoPaterno}`,
  }));

  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [NuevaContraseña, setNuevaContraseña] = useState("");
  const [ConfirmarContraseña, setConfirmarContraseña] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL

  const handleUsuarioSelectChange = (selected) => {
    setSelectedUsuario(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (NuevaContraseña !== ConfirmarContraseña) {
      setMensaje({
        tipo: "error",
        texto: "Las contraseñas no coinciden.",
      });
      return;
    }

    if (!selectedUsuario) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, selecciona un usuario.",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/restablecerPassword`,
        {
          Usuario: selectedUsuario.value,
          NuevaContraseña,
        }
      );

      if (response.status === 200) {
        navigate("/vistaGestionSistema", {
          state: {
            mensaje: {
              tipo: "exito",
              texto: "Contraseña actualizada exitosamente.",
            },
          },
        });
      } else {
        setMensaje({
          tipo: "error",
          texto: "Error al actualizar la contraseña.",
        });
      }
    } catch (error) {
      console.error("Error al restablecer la contraseña", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error al restablecer la contraseña. Por favor, inténtalo de nuevo.";
      setMensaje({
        tipo: "error",
        texto: errorMessage,
      });
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.divider,
      minHeight: '56px',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme.palette.text.primary,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? theme.palette.action.hover
        : theme.palette.background.paper,
      color: theme.palette.text.primary,
      cursor: 'pointer',
    }),
    input: (provided) => ({
      ...provided,
      color: theme.palette.text.primary,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme.palette.text.disabled,
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "0 auto",
        padding: 2,
        backgroundColor: "background.paper",
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Restablecer Contraseña
      </Typography>
      {mensaje && (
        <Alert severity={mensaje.tipo === "exito" ? "success" : "error"} sx={{ mb: 2 }}>
          {mensaje.texto}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Select
            options={opcionesUsuarios}
            value={selectedUsuario}
            onChange={handleUsuarioSelectChange}
            placeholder="Selecciona un usuario"
            styles={customSelectStyles}
            theme={(selectTheme) => ({
              ...selectTheme,
              colors: {
                ...selectTheme.colors,
                primary: theme.palette.primary.main,
                neutral0: theme.palette.background.paper,
                neutral80: theme.palette.text.primary,
                neutral20: theme.palette.divider,
                neutral60: theme.palette.text.secondary,
                neutral40: theme.palette.text.secondary,
                dangerLight: theme.palette.error.light,
                danger: theme.palette.error.main,
              },
            })}
            menuPortalTarget={document.body}
          />
          <TextField
            label="Nueva Contraseña"
            type="password"
            value={NuevaContraseña}
            onChange={(e) => setNuevaContraseña(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Confirmar Contraseña"
            type="password"
            value={ConfirmarContraseña}
            onChange={(e) => setConfirmarContraseña(e.target.value)}
            required
            fullWidth
            margin="normal"
          />

          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button variant="contained" color="primary" type="submit">
              Restablecer Contraseña
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/vistaGestionSistema")}
            >
              Regresar
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};
