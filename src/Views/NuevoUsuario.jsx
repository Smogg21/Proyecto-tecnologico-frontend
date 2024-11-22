// src/Views/NuevoUsuario.js
import { useNavigate } from "react-router-dom";
import { useRoles } from "../Hooks/useRoles";
import { useState } from "react";
import axios from "axios";
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

export const NuevoUsuario = () => {
  const { roles, loading } = useRoles();
  const navigate = useNavigate();
  const theme = useTheme();

  const opcionesRoles = roles.map((rol) => ({
    value: rol.IdRol,
    label: rol.Nombre,
  }));

  const [selectedRol, setSelectedRol] = useState(null);
  const [formValues, setFormValues] = useState({
    usuario: "",
    nombre: "",
    apellidoPaterno: "",
    contraseña: "",
  });

  const [mensaje, setMensaje] = useState(null);

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
    if (!formValues.usuario.trim()) {
      setMensaje({
        tipo: "error",
        texto: "El usuario es requerido.",
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

    try {
      const response = await axios.post("http://localhost:5000/api/nuevoUsuario", {
        ...formValues,
        IdRol: selectedRol.value,
      });

      if (response.status === 201) {
        navigate("/vistaGestionSistema", {
          state: { mensaje: { tipo: "exito", texto: "Usuario creado exitosamente." } },
        });
      } else {
        setMensaje({
          tipo: "error",
          texto: "Error al crear el usuario.",
        });
      }
    } catch (error) {
      console.error("Error al crear el usuario", error);
      const errorMessage =
        error.response?.data?.message || "Error al crear el usuario.";
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
        Nuevo Usuario
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
            label="Usuario"
            name="usuario"
            value={formValues.usuario}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contraseña"
            name="contraseña"
            type="password"
            value={formValues.contraseña}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
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
            />
          </Box>

          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button variant="contained" color="primary" type="submit">
              Crear Usuario
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
