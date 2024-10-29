import { useContext, useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useLotes } from "../Hooks/useLotes";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

export const RegistrarMovimiento = () => {
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

  const { lotes } = useLotes();
  const lotesOptions = lotes.map((lote) => ({
    value: lote.IdLote,
    label: `Lote ${lote.IdLote} - ${lote.Nombre}`,
    HasNumSerie: lote.HasNumSerie,
    IdProducto: lote.IdProducto,
  }));

  useEffect(() => {
    if (selectedLote && selectedLote.HasNumSerie) {
      // Obtener los números de serie del lote seleccionado
      const fetchSerialNumbers = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/lotes/${selectedLote.value}/serial-numbers`
          );
          const serialOptions = response.data.map((item) => ({
            value: item.NumSerie,
            label: item.NumSerie,
          }));
          setSerialNumbers(serialOptions);
        } catch (error) {
          console.error("Error fetching serial numbers:", error);
        }
      };
      fetchSerialNumbers();
    } else {
      setSerialNumbers([]);
      setSelectedSerialNumber(null);
    }
  }, [selectedLote]);

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
    if (selectedLote.HasNumSerie) {
      if (!selectedSerialNumber) {
        setMensaje({
          tipo: "error",
          texto: "Por favor, selecciona un número de serie.",
        });
        return;
      }
      // Para productos con número de serie, la cantidad debe ser 1
      if (parseInt(cantidad, 10) !== 1) {
        setMensaje({
          tipo: "error",
          texto: "La cantidad para productos con número de serie debe ser 1.",
        });
        return;
      }
    }
    if ( !cantidad || cantidad <= 0) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, ingresa una cantidad válida.",
      });
      return;
    }


    // Preparar datos para enviar
    const dataToSend = {
      IdLote: selectedLote.value,
      TipoMovimiento: tipoMovimiento.value,
      Cantidad: parseInt(cantidad, 10),
      Notas: notas || null,
      IdUsuario: IdUsuario,
      NumSerie: selectedLote.HasNumSerie ? selectedSerialNumber.value : null,
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
        // Resetear formulario
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

  const tipoMovimientoOptions = [
    { value: "Entrada", label: "Entrada" },
    { value: "Salida", label: "Salida" },
  ];

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
        <label style={{ marginBottom: "5px" }}>Lote</label>
        <Select
          options={lotesOptions}
          value={selectedLote}
          onChange={setSelectedLote}
          styles={selectStyles}
          placeholder="Selecciona un lote"
        />

        {selectedLote && selectedLote.HasNumSerie && (
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

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Tipo de Movimiento
        </label>
        <Select
          options={tipoMovimientoOptions}
          value={tipoMovimiento}
          onChange={setTipoMovimiento}
          styles={selectStyles}
          placeholder="Selecciona el tipo de movimiento"
        />

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
          disabled={selectedLote && selectedLote.HasNumSerie}
        />

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

        <button type="submit" className="button3">
          Registrar Movimiento
        </button>
        <button
          onClick={() => navigate("/VistaOperador")}
          style={{ marginTop: "20px" }}
        >
          Regresar
        </button>
      </form>
    </div>
  );
};
