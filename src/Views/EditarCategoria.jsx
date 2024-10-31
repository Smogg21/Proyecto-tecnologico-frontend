// src/Views/EditarCategoria.js
import { useNavigate } from "react-router-dom";
import { useCategoriasTodas } from "../Hooks/useCategoriasTodas";
import Select from "react-select";
import { useState} from "react";
import axios from "axios";

export const EditarCategoria = () => {
  const { categorias, loading } = useCategoriasTodas();
  const navigate = useNavigate();

  const opcionesCategorias = categorias.map((categoria) => ({
    value: categoria.IdCategoria,
    label: categoria.Nombre,
  }));

  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    descripcion: "",
    estado: true, // Por defecto, asumimos que está activa
  });

  const [mensaje, setMensaje] = useState(null);

  const handleCategoriaSelectChange = async (selected) => {
    setSelectedCategoria(selected);
    // Obtener datos de la categoría seleccionada
    try {
      const response = await axios.get(
        `http://localhost:5000/api/categorias/${selected.value}`
      );
      const categoriaData = response.data;
      setFormValues({
        nombre: categoriaData.Nombre,
        descripcion: categoriaData.Descripcion || "",
        estado: categoriaData.Estado === "Activo", // Convertimos a booleano
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
    const { name, value, type, checked } = e.target;
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
        `http://localhost:5000/api/categorias/${selectedCategoria.value}`,
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
      <h1>Editar Categoría</h1>
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
        <label style={{ marginBottom: "5px" }}>Categoría</label>
        {loading ? (
          <p>Cargando Categorías...</p>
        ) : (
          <Select
            options={opcionesCategorias}
            value={selectedCategoria}
            onChange={handleCategoriaSelectChange}
            styles={selectStyles}
            placeholder="Selecciona una categoría"
          />
        )}

        {selectedCategoria && (
          <>
            <label style={{ marginTop: "10px", marginBottom: "5px" }}>
              Nombre
            </label>
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
              value={formValues.descripcion}
              onChange={handleInputChange}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <label style={{ marginTop: "10px", marginBottom: "5px" }}>
              Estado
            </label>
            <div style={{ display: "flex", alignItems: "center", justifyContent : "center" }}>
              <input
                type="checkbox"
                name="estado"
                checked={formValues.estado}
                onChange={handleInputChange}
                style={{ marginRight: "10px" }}
              />
              <span>{formValues.estado ? "Activo" : "Inactivo"}</span>
            </div>

            <button
              type="submit"
              className="button3"
              style={{ marginTop: "30px" }}
            >
              Actualizar Categoría
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => navigate("/vistaGestionSistema")}
          style={{ marginTop: "20px" }}
        >
          Regresar
        </button>
      </form>
    </div>
  );
};
