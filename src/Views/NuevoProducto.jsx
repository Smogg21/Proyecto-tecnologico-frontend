// src/Views/NuevoProducto.jsx
import { useState } from "react";
import Select from "react-select";
import { useCategorias } from "../Hooks/useCategorias";
import { useNavigate } from "react-router-dom";

export const NuevoProducto = () => {
  const { categorias, loading, error: categoriasError } = useCategorias();
  const navigate = useNavigate();

  // Transformar las categorías para react-select
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
  });
  const [mensaje, setMensaje] = useState(null);

  const handleSelectChange = (selected) => {
    setSelectedCategoria(selected);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Asegurarse de que stockMinimo y stockMaximo sean números
    if (name === "stockMinimo" || name === "stockMaximo") {
      setFormValues({ ...formValues, [name]: parseInt(value, 10) });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos requeridos
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

    // Validar stock mínimo y máximo
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
      <h1>Nuevo Producto</h1>
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
      {categoriasError && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            color: "red",
            border: "1px solid red",
            borderRadius: "4px",
            backgroundColor: "#f8d7da",
          }}
        >
          {categoriasError}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label style={{ marginBottom: "5px" }}>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formValues.nombre}
          onChange={handleInputChange}
          required
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Descripción
        </label>
        <textarea
          name="descripcion"
          rows={4}
          placeholder="Descripción del producto"
          value={formValues.descripcion}
          onChange={handleInputChange}
          style={{
            resize: "none",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Categoría
        </label>
        {loading ? (
          <p>Cargando categorías...</p>
        ) : (
          <Select
            options={opcionesCategorias}
            value={selectedCategoria}
            onChange={handleSelectChange}
            styles={selectStyles}
            placeholder="Selecciona una categoría"
          />
        )}

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Stock Mínimo
        </label>
        <input
          type="number"
          name="stockMinimo"
          value={formValues.stockMinimo}
          onChange={handleInputChange}
          required
          min="0"
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Stock Máximo
        </label>
        <input
          type="number"
          name="stockMaximo"
          value={formValues.stockMaximo}
          onChange={handleInputChange}
          required
          min={formValues.stockMinimo}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit" className="button3"
        >
          Crear Producto
        </button>
        <button onClick={() => navigate("/vistaOperador")} style={{ marginTop: "20px" }}>Regresar</button>
      </form>
    </div>
  );
};
