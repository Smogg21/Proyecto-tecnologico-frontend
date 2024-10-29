import { useContext, useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useLotes } from "../Hooks/useLotes";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

export const RegistrarMovimiento = () => {
  // Estados para manejar los campos del formulario
  const [selectedLote, setSelectedLote] = useState(null);
  const [tipoMovimiento, setTipoMovimiento] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [notas, setNotas] = useState("");
  const [mensaje, setMensaje] = useState(null);

  // Estados para manejar los números de serie
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState(null);

  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const IdUsuario = auth.user.IdUsuario; // Obtener el IdUsuario del contexto de autenticación

  // Hook personalizado para obtener los lotes
  const { lotes } = useLotes();

  // Mapeo de los lotes para react-select
  const lotesOptions = lotes.map((lote) => ({
    value: lote.IdLote,
    label: `Lote ${lote.IdLote} - ${lote.Nombre} - Cantidad: ${lote.CantidadActual}`,
    hasNumSerie: lote.HasNumSerie, // Asignar directamente el valor booleano
    idProducto: lote.IdProducto,
  }));

  // Función para manejar la selección de un lote
  const handleLoteChange = (lote) => {
    setSelectedLote(lote);
    // Debugging: Verificar el lote seleccionado
  };
  

  const handleTipoMovimientoChange = (tipo) => {
    setTipoMovimiento(tipo);
    setSelectedSerialNumber(null); // Resetear número de serie seleccionado
  };

  // useEffect para manejar cambios en la selección de lote
  useEffect(() => {
    const fetchSerialNumbers = async () => {
      if (selectedLote && selectedLote.hasNumSerie && tipoMovimiento) {
        // Establecer cantidad en "1" para productos con número de serie
        setCantidad("1");

        // Determinar el estado a buscar según el tipo de movimiento
        const estado =
          tipoMovimiento.value === "Salida" ? "Activo" : "Inactivo";

        // Obtener los números de serie filtrados por estado
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
        // Resetear si no hay lote o tipo de movimiento seleccionado
        setSerialNumbers([]);
        setSelectedSerialNumber(null);
        if (!selectedLote || !selectedLote.hasNumSerie) {
          setCantidad("");
        }
      }
    };

    fetchSerialNumbers();
  }, [selectedLote, tipoMovimiento]);

  // Función para manejar el envío del formulario
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

  // Opciones para el tipo de movimiento
  const tipoMovimientoOptions = [
    { value: "Salida", label: "Salida" },
    { value: "Entrada", label: "Entrada" },
  ];

  // Estilos personalizados para react-select
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#4a4a4a",
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#221f22",
      color: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#221f22"
        : state.isFocused
        ? "black"
        : "gray",
      color: "white",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#333",
        color: "white",
        borderRadius: "8px",
      }}
    >
      <h1>Registrar Movimiento de Inventario</h1>

      {/* Mostrar mensajes de éxito o error */}
      {mensaje && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            color: mensaje.tipo === "exito" ? "green" : "red",
            border: `1px solid ${mensaje.tipo === "exito" ? "green" : "red"}`,
            borderRadius: "4px",
            backgroundColor: mensaje.tipo === "exito" ? "#d4edda" : "#f8d7da",
          }}
        >
          {mensaje.texto}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* Selector de Tipo de Movimiento */}
        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Tipo de Movimiento
        </label>
        <Select
          options={tipoMovimientoOptions}
          value={tipoMovimiento}
          onChange={handleTipoMovimientoChange}
          styles={selectStyles}
          placeholder="Selecciona el tipo de movimiento"
        />

        {/* Selector de Lote */}
        <label style={{ marginTop: "10px", marginBottom: "5px" }}>Lote</label>
        <Select
          options={lotesOptions}
          value={selectedLote}
          onChange={handleLoteChange}
          styles={selectStyles}
          placeholder="Selecciona un lote"
        />

        {/* Selector de Número de Serie, solo si el lote maneja números de serie */}
        {selectedLote && selectedLote.hasNumSerie && tipoMovimiento && (
          <>
            <label style={{ marginTop: "10px", marginBottom: "5px" }}>
              Número de Serie
            </label>
            <Select
              options={serialNumbers}
              value={selectedSerialNumber}
              onChange={setSelectedSerialNumber}
              styles={selectStyles}
              placeholder="Selecciona un número de serie"
            />
          </>
        )}

        {/* Campo de Cantidad */}
        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Cantidad
        </label>
        <input
          type="number"
          name="cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
          min="1"
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          disabled={selectedLote && selectedLote.hasNumSerie} // Deshabilitar si tiene número de serie
        />

        {/* Campo de Notas */}
        <label style={{ marginTop: "10px", marginBottom: "5px" }}>Notas</label>
        <textarea
          name="notas"
          rows={5}
          placeholder="Notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          style={{
            resize: "none",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        {/* Botón para Registrar Movimiento */}
        <button type="submit" className="button3">
          Registrar Movimiento
        </button>

        {/* Botón para Regresar */}
        <button
          type="button"
          onClick={() => navigate("/VistaOperador")}
          style={{ marginTop: "20px" }}
        >
          Regresar
        </button>
      </form>
    </div>
  );
};
