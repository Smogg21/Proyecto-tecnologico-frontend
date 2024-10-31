import { useNavigate } from "react-router-dom";
import { useRoles } from "../Hooks/useRoles";
import Select from "react-select";
import { useState } from "react";
import axios from "axios";

export const NuevoUsuario = () => {
  const { roles, loading } = useRoles();
  const navigate = useNavigate();

  const opcionesRoles = roles.map((rol) => ({
    value: rol.IdRol,
    label: rol.Nombre,
  }));

  const [selectedRol, setSelectedRol] = useState(null);
  const [formValues, setFormValues] = useState({
    usuario: "",
    nombre: "",
    apellidoPaterno: "",
    contraseña: "",
  });

  const [mensaje, setMensaje] = useState(null);
  const handleSelectChange = (selected) => {
    setSelectedRol(selected);
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (type === "checkbox") {
      setFormValues({ ...formValues, [name]: checked });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resetear mensaje previo
    setMensaje(null);

    // Validar campos requeridos
    if (!formValues.usuario.trim()) {
      setMensaje({
        tipo: "error",
        texto: "El usuario es requerido.",
      });
      return;
    }
    if (!formValues.nombre.trim()) {
      setMensaje({
        tipo: "error",
        texto: "El nombre es requerido.",
      });
      return;
    }
    if (!formValues.apellidoPaterno.trim()) {
      setMensaje({
        tipo: "error",
        texto: "El apellido paterno es requerido.",
      });
      return;
    }

    if (!selectedRol) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, selecciona un rol.",
      });
      return;
    }

    const response = await axios.post("http://localhost:5000/api/nuevoUsuario", {
      ...formValues,
      IdRol: selectedRol.value,
    });

    if (response.status === 201) {
      navigate("/vistaGestionUsuarios", {
        state: { mensaje: { tipo: "exito", texto: "Usuario creado exitosamente." } },
      });
    } else {
      setMensaje({
        tipo: "error",
        texto: "Error al crear el usuario.",
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
      <h1>Nuevo Usuario</h1>
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
        <label style={{ marginBottom: "5px" }}>Usuario</label>
        <input
          type="text"
          name="usuario"
          value={formValues.usuario}
          onChange={handleInputChange}
          required
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
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
        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Apellido Paterno
        </label>
        <input
          type="text"
          name="apellidoPaterno"
          value={formValues.apellidoPaterno}
          onChange={handleInputChange}
          required
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Contraseña
        </label>
        <input
          type="password"
          name="contraseña"
          value={formValues.contraseña}
          onChange={handleInputChange}
          required
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <label style={{ marginTop: "10px" }}>Rol</label>
        {loading ? (
          <p>Cargando Roles...</p>
        ) : (
          <Select
            options={opcionesRoles}
            value={selectedRol}
            onChange={handleSelectChange}
            styles={selectStyles}
            placeholder="Selecciona un rol"
          />
        )}

        <button type="submit" className="button3" style={{ marginTop: "30px"}}>
          Crear Usuario
        </button>

        <button
          onClick={() => navigate("/vistaGestionUsuarios")}
          style={{ marginTop: "20px" }}
        >
          Regresar
        </button>
      </form>
    </div>
  );
};
