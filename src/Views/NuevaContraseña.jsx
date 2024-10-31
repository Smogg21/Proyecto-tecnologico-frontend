// src/Views/NuevaContraseña.js

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUsuarios } from '../Hooks/useUsuarios';
import Select from 'react-select';

export const NuevaContraseña = () => {
  const { usuarios, loadingUsuarios } = useUsuarios();
  const navigate = useNavigate();

  const opcionesUsuarios = usuarios.map((usuario) => ({
    value: usuario.Usuario,
    label: `${usuario.Usuario} - ${usuario.Nombre} ${usuario.ApellidoPaterno}`,
  }));

  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [NuevaContraseña, setNuevaContraseña] = useState('');
  const [ConfirmarContraseña, setConfirmarContraseña] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const handleUsuarioSelectChange = (selected) => {
    setSelectedUsuario(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje(null);

    if (NuevaContraseña !== ConfirmarContraseña) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!selectedUsuario) {
      setError('Por favor, selecciona un usuario.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/restablecerPassword', {
        Usuario: selectedUsuario.value,
        NuevaContraseña,
      });

      if (response.status === 200) {
        navigate("/vistaGestionUsuarios", {
          state: { mensaje: { tipo: "exito", texto: "Contraseña actualizada exitosamente." } },
        });
      } else {
        setMensaje({
          tipo: "error",
          texto: "Error al actualizar la contraseña.",
        });
      }
    } catch (error) {
      console.error('Error al restablecer la contraseña', error);
      const errorMessage = error.response?.data?.message || 'Error al restablecer la contraseña. Por favor, inténtalo de nuevo.';
      setError(errorMessage);
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
      <h1>Restablecer Contraseña</h1>
      {error && (
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
          {error}
        </div>
      )}
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
        style={{
          display: "flex",
          flexDirection: "column",
        }}
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

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Nueva Contraseña
        </label>
        <input
          type="password"
          value={NuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
          required
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <label style={{ marginTop: "10px", marginBottom: "5px" }}>
          Confirmar Contraseña
        </label>
        <input
          type="password"
          value={ConfirmarContraseña}
          onChange={(e) => setConfirmarContraseña(e.target.value)}
          required
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <button type="submit" className="button3" style={{ marginTop: "30px" }}>
          Restablecer Contraseña
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
