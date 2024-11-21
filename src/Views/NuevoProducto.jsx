// src/Components/NuevoProducto.jsx
import  { useState } from "react";
import { useCategorias } from "../Hooks/useCategorias";
import { useNavigate } from "react-router-dom";
import NotificationListener from "../Components/NotificationListener";
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Paper,
  Autocomplete,
} from "@mui/material";

export const NuevoProducto = () => {
  const { categorias, loading, error: categoriasError } = useCategorias();
  const navigate = useNavigate();

  const opcionesCategorias = categorias.map((categoria) => ({
    value: categoria.IdCategoria,
    label: categoria.Nombre,
  }));

  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    descripcion: "",
    stockMinimo: 0,
    stockMaximo: 10,
    hasNumSerie: false,
  });
  const [mensaje, setMensaje] = useState(null);

  const handleSelectChange = (event, value) => {
    setSelectedCategoria(value);
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (type === "checkbox") {
      setFormValues({ ...formValues, [name]: checked });
    } else if (name === "stockMinimo" || name === "stockMaximo") {
      setFormValues({ ...formValues, [name]: parseInt(value, 10) });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formValues.nombre.trim()) {
      setMensaje({
        tipo: "error",
        texto: "El nombre del producto es requerido.",
      });
      return;
    }

    if (!selectedCategoria) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, selecciona una categoría.",
      });
      return;
    }

    if (formValues.stockMinimo < 0) {
      setMensaje({
        tipo: "error",
        texto: "El stock mínimo no puede ser negativo.",
      });
      return;
    }

    if (formValues.stockMaximo < formValues.stockMinimo) {
      setMensaje({
        tipo: "error",
        texto: "El stock máximo debe ser mayor o igual al stock mínimo.",
      });
      return;
    }

    // Preparar los datos a enviar
    const dataToSend = {
      Nombre: formValues.nombre,
      Descripcion: formValues.descripcion || null,
      IdCategoria: selectedCategoria.value,
      StockMinimo: formValues.stockMinimo,
      StockMaximo: formValues.stockMaximo,
      HasNumSerie: formValues.hasNumSerie ? 1 : 0,
    };

    try {
      const response = await fetch("http://localhost:5000/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        setMensaje({
          tipo: "exito",
          texto: `Producto creado con éxito. ID: ${result.IdProducto}`,
        });
        // Resetear el formulario
        setSelectedCategoria(null);
        setFormValues({
          nombre: "",
          descripcion: "",
          stockMinimo: 0,
          stockMaximo: 10,
          hasNumSerie: false,
        });
      } else {
        const error = await response.json();
        setMensaje({
          tipo: "error",
          texto: error.message || "Error al crear el producto.",
        });
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setMensaje({
        tipo: "error",
        texto: "Error al conectar con el servidor.",
      });
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: "600px",
        margin: { 
          xs: "16px",      // Margen de 16px en pantallas extra pequeñas (móviles)
          sm: "24px auto", // Margen superior e inferior de 24px y centrado horizontalmente en pantallas pequeñas y mayores
        },
        padding: "20px",
        mt: 4,
      }}
    >
      <NotificationListener />
      <Typography variant="h4" gutterBottom>
        Nuevo Producto
      </Typography>
      {mensaje && (
        <Box
          sx={{
            padding: "10px",
            marginBottom: "15px",
            color: mensaje.tipo === "exito" ? "green" : "red",
            border: `1px solid ${mensaje.tipo === "exito" ? "green" : "red"}`,
            borderRadius: "4px",
            backgroundColor:
              mensaje.tipo === "exito" ? "#d4edda" : "#f8d7da",
          }}
        >
          {mensaje.texto}
        </Box>
      )}
      {categoriasError && (
        <Box
          sx={{
            padding: "10px",
            marginBottom: "15px",
            color: "red",
            border: "1px solid red",
            borderRadius: "4px",
            backgroundColor: "#f8d7da",
          }}
        >
          {categoriasError}
        </Box>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          name="nombre"
          value={formValues.nombre}
          onChange={handleInputChange}
          required
          variant="outlined"
          margin="normal"
          fullWidth
        />

        <TextField
          label="Descripción"
          name="descripcion"
          value={formValues.descripcion}
          onChange={handleInputChange}
          variant="outlined"
          margin="normal"
          fullWidth
          multiline
          rows={4}
        />

        {loading ? (
          <Typography>Cargando categorías...</Typography>
        ) : (
          <Autocomplete
            options={opcionesCategorias}
            getOptionLabel={(option) => option.label}
            value={selectedCategoria}
            onChange={handleSelectChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Categoría"
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />
            )}
          />
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={formValues.hasNumSerie}
              onChange={handleInputChange}
              name="hasNumSerie"
              color="primary"
            />
          }
          label="¿Tiene número de serie?"
          sx={{ mt: 2 }}
        />

        <TextField
          label="Stock Mínimo"
          type="number"
          name="stockMinimo"
          value={formValues.stockMinimo}
          onChange={handleInputChange}
          required
          inputProps={{ min: 0 }}
          variant="outlined"
          margin="normal"
          fullWidth
        />

        <TextField
          label="Stock Máximo"
          type="number"
          name="stockMaximo"
          value={formValues.stockMaximo}
          onChange={handleInputChange}
          required
          inputProps={{ min: formValues.stockMinimo }}
          variant="outlined"
          margin="normal"
          fullWidth
        />

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" type="submit">
            Crear Producto
          </Button>
          <Button variant="outlined" onClick={() => navigate("/vistaOperador")}>
            Regresar
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
