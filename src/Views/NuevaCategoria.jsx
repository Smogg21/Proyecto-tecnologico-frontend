// src/Views/NuevaCategoria.js
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

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
      <h1>Nueva Categoría</h1>
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
        <label style={{ marginTop: "10px", marginBottom: "5px" }}>Nombre</label>
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
        <label style={{ marginTop: "10px", marginBottom: "5px" }}>Descripción</label>
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

        <button type="submit" className="button3" style={{ marginTop: "30px" }}>
          Crear Categoría
        </button>

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
