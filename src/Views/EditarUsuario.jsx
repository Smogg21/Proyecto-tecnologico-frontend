// src/Views/EditarUsuario.js
import { useNavigate } from "react-router-dom";
import { useRoles } from "../Hooks/useRoles";
import { useUsuarios } from "../Hooks/useUsuarios";
import Select from "react-select";
import { useState } from "react";
import axios from "axios";

export const EditarUsuario = () => {
  const { roles, loading } = useRoles();
  const { usuarios, loadingUsuarios } = useUsuarios();
  const navigate = useNavigate();

  const opcionesRoles = roles.map((rol) => ({
    value: rol.IdRol,
    label: rol.Nombre,
  }));

  const opcionesUsuarios = usuarios.map((usuario) => ({
    value: usuario.IdUsuario,
    label: `${usuario.Usuario} - ${usuario.Nombre} ${usuario.ApellidoPaterno}`,
  }));

  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [selectedRol, setSelectedRol] = useState(null);
  const [formValues, setFormValues] = useState({
    usuario: "",
    nombre: "",
    apellidoPaterno: "",
    estado: "",
  });

  const [mensaje, setMensaje] = useState(null);

  const handleUsuarioSelectChange = async (selected) => {
    setSelectedUsuario(selected);
    // Obtener datos del usuario seleccionado
    try {
      const response = await axios.get(`http://localhost:5000/api/usuarios/${selected.value}`);
      const userData = response.data;
      setFormValues({
        usuario: userData.Usuario,
        nombre: userData.Nombre,
        apellidoPaterno: userData.ApellidoPaterno,
        estado: userData.Estado,
      });
      const userRol = roles.find((rol) => rol.IdRol === userData.IdRol);
      setSelectedRol({ value: userRol.IdRol, label: userRol.Nombre });
    } catch (error) {
      console.error("Error al obtener los datos del usuario", error);
      setMensaje({
        tipo: "error",
        texto: "Error al obtener los datos del usuario.",
      });
    }
  };

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
    if (!selectedUsuario) {
      setMensaje({
        tipo: "error",
        texto: "Por favor, selecciona un usuario.",
      });
      return;
    }
    if (!formValues.usuario.trim()) {
      setMensaje({
        tipo: "error",
        texto: "El nombre de usuario es requerido.",
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

    // Enviar solicitud PUT para actualizar el usuario
    try {
      const response = await axios.put(
        `http://localhost:5000/api/usuarios/${selectedUsuario.value}`,
        {
          usuario: formValues.usuario,
          nombre: formValues.nombre,
          apellidoPaterno: formValues.apellidoPaterno,
          IdRol: selectedRol.value,
          estado: formValues.estado,
        }
      );

      if (response.status === 200) {
        navigate("/vistaGestionUsuarios", {
          state: { mensaje: { tipo: "exito", texto: "Usuario actualizado exitosamente." } },
        });
      } else {
        setMensaje({
          tipo: "error",
          texto: "Error al actualizar el usuario.",
        });
      }
    } catch (error) {
      console.error("Error al actualizar el usuario", error);
      const errorMessage = error.response?.data?.message || "Error al actualizar el usuario.";
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
      <h1>Editar Usuario</h1>
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
        {loadingUsuarios ? (
          <p>Cargando Usuarios...</p>
        ) : (
          <Select
            options={opcionesUsuarios}
            value={selectedUsuario}
            onChange={handleUsuarioSelectChange}
            styles={selectStyles}
            placeholder="Selecciona un usuario"
          />
        )}

        {selectedUsuario && (
          <>
            
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
            <label style={{ marginTop: "10px", marginBottom: "5px" }}>Nombre de Usuario</label>
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

            <label style={{ marginTop: "10px", marginBottom: "5px" }}>Estado</label>
            <select
              name="estado"
              value={formValues.estado}
              onChange={handleInputChange}
              required
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#4a4a4a",
                color: "white",
              }}
            >
              <option value="">Selecciona un estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>

            <button type="submit" className="button3" style={{ marginTop: "30px" }}>
              Actualizar Usuario
            </button>
          </>
        )}

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
