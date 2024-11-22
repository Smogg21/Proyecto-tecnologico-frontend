// src/Views/NuevaCategoria.js
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

export const NuevaCategoria = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    nombre: "",
    descripcion: "",
  });

  const [mensaje, setMensaje] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues({ ...formValues, [name]: value });
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
      const response = await axios.post("http://localhost:5000/api/categorias", {
        Nombre: formValues.nombre,
        Descripcion: formValues.descripcion,
      });

      if (response.status === 201) {
        navigate("/vistaGestionSistema", {
          state: { mensaje: { tipo: "exito", texto: "Categoría creada exitosamente." } },
        });
      } else {
        setMensaje({
          tipo: "error",
          texto: "Error al crear la categoría.",
        });
      }
    } catch (error) {
      console.error("Error al crear la categoría", error);
      const errorMessage = error.response?.data?.message || "Error al crear la categoría.";
      setMensaje({
        tipo: "error",
        texto: errorMessage,
      });
    }
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
        Nueva Categoría
      </Typography>
      {mensaje && (
        <Alert severity={mensaje.tipo === "exito" ? "success" : "error"} sx={{ mb: 2 }}>
          {mensaje.texto}
        </Alert>
      )}
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
          label="Descripción"
          name="descripcion"
          value={formValues.descripcion}
          onChange={handleInputChange}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="contained" color="primary" type="submit">
            Crear Categoría
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
    </Box>
  );
};
