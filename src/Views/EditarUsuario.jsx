// src/Views/EditarUsuario.js
import { useNavigate } from "react-router-dom";
import { useRoles } from "../Hooks/useRoles";
import { useUsuarios } from "../Hooks/useUsuarios";
import { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  useTheme,
} from "@mui/material";
import Select from "react-select";

export const EditarUsuario = () => {
  const { roles, loading: loadingRoles } = useRoles();
  const { usuarios, loading: loadingUsuarios } = useUsuarios();
  const navigate = useNavigate();
  const theme = useTheme();

  const opcionesRoles = roles.map((rol) => ({
    value: rol.IdRol,
    label: rol.Nombre,
  }));

  const opcionesUsuarios = usuarios.map((usuario) => ({
    value: usuario.IdUsuario,
    label: `${usuario.Usuario} - ${usuario.Nombre} ${usuario.ApellidoPaterno}`,
  }));

  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [selectedRol, setSelectedRol] = useState(null);
  const [formValues, setFormValues] = useState({
    usuario: "",
    nombre: "",
    apellidoPaterno: "",
    estado: "",
  });

  const [mensaje, setMensaje] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL

  const handleUsuarioSelectChange = async (selected) => {
    setSelectedUsuario(selected);
    // Obtener datos del usuario seleccionado
    try {
      const response = await axios.get(
        `${apiUrl}/api/usuarios/${selected.value}`
      );
      const userData = response.data;
      setFormValues({
        usuario: userData.Usuario,
        nombre: userData.Nombre,
        apellidoPaterno: userData.ApellidoPaterno,
        estado: userData.Estado,
      });
      const userRol = roles.find((rol) => rol.IdRol === userData.IdRol);
      setSelectedRol({ value: userRol.IdRol, label: userRol.Nombre });
    } catch (error) {
      console.error("Error al obtener los datos del usuario", error);
      setMensaje({
        tipo: "error",
        texto: "Error al obtener los datos del usuario.",
      });
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedRol(selected);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resetear mensaje previo
    setMensaje(null);

    // Validar campos requeridos
    if (!selectedUsuario) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, selecciona un usuario.",
      });
      return;
    }
    if (!formValues.usuario.trim()) {
      setMensaje({
        tipo: "error",
        texto: "El nombre de usuario es requerido.",
      });
      return;
    }
    if (!formValues.nombre.trim()) {
      setMensaje({
        tipo: "error",
        texto: "El nombre es requerido.",
      });
      return;
    }
    if (!formValues.apellidoPaterno.trim()) {
      setMensaje({
        tipo: "error",
        texto: "El apellido paterno es requerido.",
      });
      return;
    }

    if (!selectedRol) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, selecciona un rol.",
      });
      return;
    }

    // Enviar solicitud PUT para actualizar el usuario
    try {
      const response = await axios.put(
        `${apiUrl}/api/usuarios/${selectedUsuario.value}`,
        {
          usuario: formValues.usuario,
          nombre: formValues.nombre,
          apellidoPaterno: formValues.apellidoPaterno,
          IdRol: selectedRol.value,
          estado: formValues.estado,
        }
      );

      if (response.status === 200) {
        navigate("/vistaGestionSistema", {
          state: {
            mensaje: {
              tipo: "exito",
              texto: "Usuario actualizado exitosamente.",
            },
          },
        });
      } else {
        setMensaje({
          tipo: "error",
          texto: "Error al actualizar el usuario.",
        });
      }
    } catch (error) {
      console.error("Error al actualizar el usuario", error);
      const errorMessage =
        error.response?.data?.message || "Error al actualizar el usuario.";
      setMensaje({
        tipo: "error",
        texto: errorMessage,
      });
    }
  };

  // Define estilos personalizados para react-select basados en el tema
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.divider,
      minHeight: "56px",
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
      cursor: "pointer",
    }),
    input: (provided) => ({
      ...provided,
      color: theme.palette.text.primary,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme.palette.text.disabled,
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }), // Asegura que el menú esté por encima
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
        Editar Usuario
      </Typography>
      {mensaje && (
        <Alert
          severity={mensaje.tipo === "exito" ? "success" : "error"}
          sx={{ mb: 2 }}
        >
          {mensaje.texto}
        </Alert>
      )}

      {loadingUsuarios ? (
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
            styles={customSelectStyles} // Aplica estilos personalizados
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
            menuPortalTarget={document.body} // Renderiza el menú en un portal
          />

          {selectedUsuario && (
            <>
              <TextField
                label="Nombre"
                name="nombre"
                value={formValues.nombre}
                onChange={handleInputChange}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Apellido Paterno"
                name="apellidoPaterno"
                value={formValues.apellidoPaterno}
                onChange={handleInputChange}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Nombre de Usuario"
                name="usuario"
                value={formValues.usuario}
                onChange={handleInputChange}
                required
                fullWidth
                margin="normal"
              />
              {loadingRoles ? (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box mt={2}>
                  <Select
                    options={opcionesRoles}
                    value={selectedRol}
                    onChange={handleSelectChange}
                    placeholder="Selecciona un rol"
                    styles={customSelectStyles} // Aplica estilos personalizados
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
                    menuPortalTarget={document.body} // Renderiza el menú en un portal
                  />
                </Box>
              )}
              <TextField
                label="Estado"
                name="estado"
                value={formValues.estado}
                onChange={handleInputChange}
                select
                required
                fullWidth
                margin="normal"
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </TextField>
            </>
          )}
          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button variant="contained" color="primary" type="submit">
              Actualizar Usuario
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
