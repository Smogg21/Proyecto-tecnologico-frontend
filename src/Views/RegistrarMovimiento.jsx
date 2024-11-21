// src/Components/RegistrarMovimiento.jsx
import  { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLotes } from "../Hooks/useLotes";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import NotificationListener from "../Components/NotificationListener";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  Autocomplete,
} from "@mui/material";

export const RegistrarMovimiento = () => {
  // Estados y hooks
  const [selectedLote, setSelectedLote] = useState(null);
  const [tipoMovimiento, setTipoMovimiento] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [notas, setNotas] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState(null);

  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const IdUsuario = auth.user.IdUsuario;

  const { lotes, refetch } = useLotes();

  const lotesOptions = lotes.map((lote) => ({
    value: lote.IdLote,
    label: `Lote ${lote.IdLote} - ${lote.Nombre} - Cantidad Actual: ${lote.CantidadActual} - Inicial: ${lote.CantidadInicial}`,
    hasNumSerie: lote.HasNumSerie,
    idProducto: lote.IdProducto,
  }));

  const handleLoteChange = (event, value) => {
    setSelectedLote(value);
  };

  const handleTipoMovimientoChange = (event, value) => {
    setTipoMovimiento(value);
    setSelectedSerialNumber(null);
  };

  useEffect(() => {
    const fetchSerialNumbers = async () => {
      if (selectedLote && selectedLote.hasNumSerie && tipoMovimiento) {
        setCantidad("1");
        const estado =
          tipoMovimiento.value === "Salida" ? "Activo" : "Inactivo";
        try {
          const response = await axios.get(
            `http://localhost:5000/api/lotes/${selectedLote.value}/serial-numbers`,
            {
              params: { estado },
            }
          );
          const serialOptions = response.data.map((item) => ({
            value: item.NumSerie,
            label: item.NumSerie,
          }));
          setSerialNumbers(serialOptions);
        } catch (error) {
          console.error("Error fetching serial numbers:", error);
          setMensaje({
            tipo: "error",
            texto: "Error al obtener los números de serie.",
          });
        }
      } else {
        setSerialNumbers([]);
        setSelectedSerialNumber(null);
        if (!selectedLote || !selectedLote.hasNumSerie) {
          setCantidad("");
        }
      }
    };

    fetchSerialNumbers();
  }, [selectedLote, tipoMovimiento]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!selectedLote) {
      setMensaje({ tipo: "error", texto: "Por favor, selecciona un lote." });
      return;
    }
    if (!tipoMovimiento) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, selecciona un tipo de movimiento.",
      });
      return;
    }

    const cantidadInt = parseInt(cantidad, 10);
    if (isNaN(cantidadInt) || cantidadInt <= 0) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, ingresa una cantidad válida.",
      });
      return;
    }

    if (selectedLote.hasNumSerie) {
      if (!selectedSerialNumber) {
        setMensaje({
          tipo: "error",
          texto: "Por favor, selecciona un número de serie.",
        });
        return;
      }
      // La cantidad debe ser 1 para productos con número de serie
      if (cantidadInt !== 1) {
        setMensaje({
          tipo: "error",
          texto: "La cantidad para productos con número de serie debe ser 1.",
        });
        return;
      }
    }

    // Preparar datos para enviar al backend
    const dataToSend = {
      IdLote: selectedLote.value,
      TipoMovimiento: tipoMovimiento.value,
      Cantidad: cantidadInt,
      Notas: notas || null,
      IdUsuario: IdUsuario,
      NumSerie: selectedLote.hasNumSerie ? selectedSerialNumber.value : null,
    };

    try {
      const response = await fetch("http://localhost:5000/api/movimientos", {
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
          texto: `Movimiento registrado con éxito. ID: ${result.IdMovimiento}`,
        });
        // Resetear el formulario
        setSelectedLote(null);
        setTipoMovimiento(null);
        setCantidad("");
        setNotas("");
        setSerialNumbers([]);
        setSelectedSerialNumber(null);
        refetch();
      } else {
        const error = await response.json();
        setMensaje({
          tipo: "error",
          texto: error.message || "Error al registrar el movimiento.",
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

  const tipoMovimientoOptions = [
    { value: "Salida", label: "Salida" },
    { value: "Entrada", label: "Entrada" },
  ];

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
        Registrar Movimiento de Inventario
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

      <form onSubmit={handleSubmit}>
        <Autocomplete
          options={tipoMovimientoOptions}
          getOptionLabel={(option) => option.label}
          value={tipoMovimiento}
          onChange={handleTipoMovimientoChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tipo de Movimiento"
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
          )}
        />

        <Autocomplete
          options={lotesOptions}
          getOptionLabel={(option) => option.label}
          value={selectedLote}
          onChange={handleLoteChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Lote"
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
          )}
        />

        {selectedLote && selectedLote.hasNumSerie && tipoMovimiento && (
          <Autocomplete
            options={serialNumbers}
            getOptionLabel={(option) => option.label}
            value={selectedSerialNumber}
            onChange={(event, value) => setSelectedSerialNumber(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Número de Serie"
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />
            )}
          />
        )}

        <TextField
          label="Cantidad"
          type="number"
          name="cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
          inputProps={{ min: 1 }}
          variant="outlined"
          margin="normal"
          fullWidth
          disabled={selectedLote && selectedLote.hasNumSerie}
        />

        <TextField
          label="Notas"
          name="notas"
          rows={4}
          multiline
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          variant="outlined"
          margin="normal"
          fullWidth
        />

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" type="submit">
            Registrar
          </Button>
          <Button variant="outlined" onClick={() => navigate("/VistaOperador")}>
            Regresar
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
