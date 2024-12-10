// src/Views/EditarCategoria.js
import { useNavigate } from "react-router-dom";
import { useCategoriasTodas } from "../Hooks/useCategoriasTodas";
import { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  FormControlLabel,
  Switch,
  CircularProgress,
  useTheme,
} from "@mui/material";
import Select from "react-select";

export const EditarCategoria = () => {
  const { categorias, loading } = useCategoriasTodas();
  const navigate = useNavigate();
  const theme = useTheme();

  const opcionesCategorias = categorias.map((categoria) => ({
    value: categoria.IdCategoria,
    label: categoria.Nombre,
  }));

  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    descripcion: "",
    estado: true,
  });

  const [mensaje, setMensaje] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleCategoriaSelectChange = async (selected) => {
    setSelectedCategoria(selected);
    // Obtener datos de la categoría seleccionada
    try {
      const response = await axios.get(
        `${apiUrl}/api/categorias/${selected.value}`
      );
      const categoriaData = response.data;
      setFormValues({
        nombre: categoriaData.Nombre,
        descripcion: categoriaData.Descripcion || "",
        estado: categoriaData.Estado === "Activo",
      });
    } catch (error) {
      console.error("Error al obtener los datos de la categoría", error);
      setMensaje({
        tipo: "error",
        texto: "Error al obtener los datos de la categoría.",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resetear mensaje previo
    setMensaje(null);

    // Validar campos requeridos
    if (!formValues.nombre.trim()) {
      setMensaje({
        tipo: "error",
        texto: "El nombre de la categoría es requerido.",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${apiUrl}/api/categorias/${selectedCategoria.value}`,
        {
          Nombre: formValues.nombre,
          Descripcion: formValues.descripcion,
          Estado: formValues.estado ? "Activo" : "Inactivo",
        }
      );

      if (response.status === 200) {
        navigate("/vistaGestionSistema", {
          state: {
            mensaje: {
              tipo: "exito",
              texto: "Categoría actualizada exitosamente.",
            },
          },
        });
      } else {
        setMensaje({
          tipo: "error",
          texto: "Error al actualizar la categoría.",
        });
      }
    } catch (error) {
      console.error("Error al actualizar la categoría", error);
      const errorMessage =
        error.response?.data?.message || "Error al actualizar la categoría.";
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
        Editar Categoría
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
            options={opcionesCategorias}
            value={selectedCategoria}
            onChange={handleCategoriaSelectChange}
            placeholder="Selecciona una categoría"
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

          {selectedCategoria && (
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
                label="Descripción"
                name="descripcion"
                value={formValues.descripcion}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
                margin="normal"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formValues.estado}
                    onChange={handleInputChange}
                    name="estado"
                    color="primary"
                  />
                }
                label={formValues.estado ? "Activo" : "Inactivo"}
                sx={{ mt: 2 }}
              />

            </>
          )}
              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button variant="contained" color="primary" type="submit">
                  Actualizar Categoría
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
