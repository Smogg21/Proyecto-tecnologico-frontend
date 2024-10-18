import { useContext, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useLotes } from "../Hooks/useLotes";
import { AuthContext } from "../contexts/AuthContext";

export const RegistrarMovimiento = () => {
  const [selectedLote, setSelectedLote] = useState(null);
  const [tipoMovimiento, setTipoMovimiento] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [notas, setNotas] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  // Asumiendo que tienes un sistema de autenticación y puedes obtener el IdUsuario

  const IdUsuario = auth.user.IdUsuario; // Reemplaza esto con el IdUsuario real

  const { lotes } = useLotes();
  const lotesOptions = lotes.map((lote) => ({
    value: lote.IdLote,
    label: `Lote ${lote.IdLote} - ${lote.Nombre}`,
  }));

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
    if (!cantidad || cantidad <= 0) {
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

        <button
          type="submit"
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Registrar Movimiento
        </button>
        <button onClick={() => navigate("/VistaOperador")} style={{ marginTop: "20px" }}>Regresar</button>
      </form>
    </div>
  );
};
