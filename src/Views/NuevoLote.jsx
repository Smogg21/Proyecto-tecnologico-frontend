import { useState } from "react";
import Select from "react-select";
import { useProductos } from "../Hooks/useProductos";
import { useNavigate } from "react-router-dom";

export const NuevoLote = () => {
  const nombres = useProductos();
  const opciones = nombres.map((nombre) => ({ value: nombre.IdProducto, label: nombre.Nombre }));
  const [selectedOption, setSelectedOption] = useState(null); 
  const [formValues, setFormValues] = useState({
    fechaCaducidad: "",
    fechaEntrada: "",
    cantidad: "",
    notas: "", 
  });
  const navigate = useNavigate();
  const goToInventory = () => {
    navigate('/inventario');
  };
  const [mensaje, setMensaje] = useState(null); 

  const handleSelectChange = (selected) => {
    setSelectedOption(selected); 
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que se haya seleccionado un producto
    if (!selectedOption) {
      setMensaje({ tipo: 'error', texto: 'Por favor, selecciona un producto.' });
      return;
    }

    // Preparar los datos a enviar
    const dataToSend = {
      producto: selectedOption.value, // El value seleccionado en react-select
      fechaCaducidad: formValues.fechaCaducidad || null,
      fechaEntrada: formValues.fechaEntrada || null, // Si está vacío, el servidor usará la fecha actual
      cantidad: formValues.cantidad,
      notas: formValues.notas || null,
    };

    try {
      const response = await fetch('http://localhost:5000/api/lotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        setMensaje({ tipo: 'exito', texto: `Lote creado con éxito. ID: ${result.IdLote}` });
        // Resetear el formulario
        setSelectedOption(null);
        setFormValues({
          fechaCaducidad: "",
          fechaEntrada: "",
          cantidad: "",
          notas: "",
        });
      } else {
        const error = await response.json();
        setMensaje({ tipo: 'error', texto: error.message || 'Error al crear el lote.' });
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setMensaje({ tipo: 'error', texto: 'Error al conectar con el servidor.' });
    }
  };

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#4a4a4a", // Cambiar el fondo del select
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#221f22", // Cambiar el fondo del menú desplegable
      color: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#221f22" : state.isFocused ? "black" : "gray", // Fondo de las opciones
      color: "white",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white", // Cambiar el color del texto seleccionado
    }),
    input: (provided) => ({
      ...provided,
      color: "white", // Cambiar el color del texto que escribes en el input
    }),
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", backgroundColor: "#333", color: "white", borderRadius: "8px" }}>
      <h1>Nuevo Lote</h1>
      {mensaje && (
        <div style={{
          padding: "10px",
          marginBottom: "15px",
          color: mensaje.tipo === 'exito' ? 'green' : 'red',
          border: `1px solid ${mensaje.tipo === 'exito' ? 'green' : 'red'}`,
          borderRadius: "4px",
          backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : '#f8d7da',
        }}>
          {mensaje.texto}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ marginBottom: "5px" }}>Producto</label>
        <Select
          options={opciones}
          value={selectedOption}
          onChange={handleSelectChange}
          styles={selectStyles}
          placeholder="Busca un Producto"
        />

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>Fecha de Caducidad</label>
        <input
          type="date"
          name="fechaCaducidad"
          value={formValues.fechaCaducidad}
          onChange={handleInputChange}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>Fecha de Entrada</label>
        <input
          type="date"
          name="fechaEntrada"
          value={formValues.fechaEntrada}
          onChange={handleInputChange}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>Cantidad</label>
        <input
          type="number"
          name="cantidad"
          value={formValues.cantidad}
          onChange={handleInputChange}
          required
          min="0"
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>Descripción</label>
        <textarea
          name="notas"
          rows={5}
          placeholder="Notas"
          value={formValues.notas}
          onChange={handleInputChange}
          style={{ resize: "none", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
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
          Enviar
        </button>
      </form>
      <button onClick={goToInventory}>Ir a Inventario</button>
    </div>
  );
};
