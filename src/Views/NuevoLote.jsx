/* eslint-disable react-hooks/exhaustive-deps */
// src/Components/NuevoLote.jsx
import { useContext, useState, useEffect } from "react";
import { useProductos } from "../Hooks/useProductos";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  Autocomplete,
} from "@mui/material";
import { OperadorLayout } from "../Layout/OperadorLayout";
import axios from "axios";
import io from "socket.io-client";

export const NuevoLote = () => {
  const productos = useProductos();
  const opciones = productos.map((producto) => ({
    value: producto.IdProducto,
    label: producto.Nombre,
    HasNumSerie: producto.HasNumSerie,
  }));
  const { auth } = useContext(AuthContext);
  const [stockStopActive, setStockStopActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formValues, setFormValues] = useState({
    fechaCaducidad: "",
    fechaEntrada: "",
    cantidad: "",
    notas: "",
  });
  const [serialNumbers, setSerialNumbers] = useState([]);
  const navigate = useNavigate();
  const regresar = () => {
    navigate("/VistaOperador");
  };
  const [mensaje, setMensaje] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL

  const handleSelectChange = (event, value) => {
    setSelectedOption(value);
    const selectedProd = productos.find((p) => p.IdProducto === value?.value);
    setSelectedProduct(selectedProd);
    // Resetear campos al cambiar de producto
    setFormValues({ ...formValues, cantidad: "" });
    setSerialNumbers([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    // Manejar cambios en la cantidad
    if (name === "cantidad" && selectedProduct && selectedProduct.HasNumSerie) {
      const qty = parseInt(value, 10) || 0;
      const serials = Array(qty).fill("");
      setSerialNumbers(serials);
    }
  };

  const handleSerialNumberChange = (e, index) => {
    const newSerialNumbers = [...serialNumbers];
    newSerialNumbers[index] = e.target.value;
    setSerialNumbers(newSerialNumbers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que se haya seleccionado un producto
    if (!selectedOption) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, selecciona un producto.",
      });
      return;
    }

    // Validar que la cantidad sea positiva
    const cantidadInt = parseInt(formValues.cantidad, 10);
    if (isNaN(cantidadInt) || cantidadInt <= 0) {
      setMensaje({
        tipo: "error",
        texto: "La cantidad debe ser un número entero positivo.",
      });
      return;
    }

    // Validar números de serie si el producto los maneja
    if (selectedProduct && selectedProduct.HasNumSerie) {
      if (serialNumbers.some((serial) => serial.trim() === "")) {
        setMensaje({
          tipo: "error",
          texto: "Por favor, ingresa todos los números de serie.",
        });
        return;
      }
    }

    const usuario = auth.user.IdUsuario;
    // Preparar los datos a enviar
    const dataToSend = {
      producto: selectedOption.value,
      fechaCaducidad: formValues.fechaCaducidad || null,
      fechaEntrada: formValues.fechaEntrada || null,
      cantidad: formValues.cantidad,
      notas: formValues.notas || null,
      idUsuario: usuario,
    };

    if (selectedProduct && selectedProduct.HasNumSerie) {
      dataToSend.serialNumbers = serialNumbers;
    }

    try {
      const response = await fetch(`${apiUrl}/api/lotes`, {
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
          texto: `Lote creado con éxito. ID: ${result.IdLote}`,
        });
        // Resetear el formulario
        setSelectedOption(null);
        setSelectedProduct(null);
        setFormValues({
          fechaCaducidad: "",
          fechaEntrada: "",
          cantidad: "",
          notas: "",
        });
        setSerialNumbers([]);
      } else {
        const error = await response.json();
        setMensaje({
          tipo: "error",
          texto: error.message || "Error al crear el lote.",
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

    // Configurar Socket.IO para escuchar cambios
    const socket = io("http://localhost:5000", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socket.on("stockStopActivated", () => {
      setStockStopActive(true);
    });

    socket.on("stockStopDeactivated", () => {
      setStockStopActive(false);
    });

    return () => {
      socket.off("stockStopActivated");
      socket.off("stockStopDeactivated");
      socket.disconnect();
    };
  }, []);

  return (
    <OperadorLayout>
      {stockStopActive && (
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{ color: "error.main" }}
        >
          ¡ATENCIÓN! La Parada de stock está activada
        </Typography>
      )}
      <Paper
        elevation={3}
        sx={{
          maxWidth: "600px",
          margin: {
            xs: "16px", // Margen de 16px en pantallas extra pequeñas (móviles)
            sm: "24px auto", // Margen superior e inferior de 24px y centrado horizontalmente en pantallas pequeñas y mayores
          },
          padding: "20px",
          mt: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Nuevo Lote
        </Typography>
        {mensaje && (
          <Box
            sx={{
              padding: "10px",
              marginBottom: "15px",
              color: mensaje.tipo === "exito" ? "green" : "red",
              border: `1px solid ${mensaje.tipo === "exito" ? "green" : "red"}`,
              borderRadius: "4px",
              backgroundColor: mensaje.tipo === "exito" ? "#d4edda" : "#f8d7da",
            }}
          >
            {mensaje.texto}
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <Autocomplete
            options={opciones}
            getOptionLabel={(option) => option.label}
            value={selectedOption}
            onChange={handleSelectChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Producto"
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />
            )}
          />

          <TextField
            label="Fecha de Caducidad"
            type="date"
            name="fechaCaducidad"
            value={formValues.fechaCaducidad}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            margin="normal"
            fullWidth
          />

          <TextField
            label="Fecha de Entrada"
            type="datetime-local"
            name="fechaEntrada"
            value={formValues.fechaEntrada}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            margin="normal"
            fullWidth
          />

          <TextField
            label="Cantidad"
            type="number"
            name="cantidad"
            value={formValues.cantidad}
            onChange={handleInputChange}
            required
            inputProps={{ min: 0 }}
            variant="outlined"
            margin="normal"
            fullWidth
          />

          {/* Mostrar inputs de números de serie si el producto los maneja */}
          {selectedProduct &&
            selectedProduct.HasNumSerie &&
            serialNumbers.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle1">
                  Ingrese los números de serie:
                </Typography>
                {serialNumbers.map((serial, index) => (
                  <TextField
                    key={index}
                    label={`Número de serie ${index + 1}`}
                    value={serial}
                    onChange={(e) => handleSerialNumberChange(e, index)}
                    required
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                ))}
              </Box>
            )}

          <TextField
            label="Descripción"
            name="notas"
            rows={4}
            multiline
            value={formValues.notas}
            onChange={handleInputChange}
            variant="outlined"
            margin="normal"
            fullWidth
          />

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" type="submit">
              Enviar
            </Button>
            <Button variant="outlined" onClick={regresar}>
              Regresar
            </Button>
          </Box>
        </form>
      </Paper>
    </OperadorLayout>
  );
};
