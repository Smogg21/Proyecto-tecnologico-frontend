// src/Views/NuevaContraseña.js

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const NuevaContraseña = () => {
  const [Usuario, setUsuario] = useState('');
  const [NuevaContraseña, setNuevaContraseña] = useState('');
  const [ConfirmarContraseña, setConfirmarContraseña] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (NuevaContraseña !== ConfirmarContraseña) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/restablecerPassword', {
        Usuario,
        NuevaContraseña,
      });

      // Asumiendo que el backend devuelve un mensaje de éxito
      setMensaje('Contraseña restablecida correctamente.');

    } catch (error) {
      console.error('Error al restablecer la contraseña', error);
      setError('Error al restablecer la contraseña. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="reset-password-container" style={{width: '310px'}}>
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', border: '1px solid #ccc', padding: '10px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <label>Usuario:</label>
          <input
            type="text"
            value={Usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <label>Nueva Contraseña:</label>
          <input
            type="password"
            value={NuevaContraseña}
            onChange={(e) => setNuevaContraseña(e.target.value)}
            required
          />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            value={ConfirmarContraseña}
            onChange={(e) => setConfirmarContraseña(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Restablecer Contraseña</button>
        <button
          onClick={() => navigate("/vistaAdministrador")}
          style={{ marginTop: '10px' }}
        >
          Regresar
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      </form>
    </div>
  );
};
