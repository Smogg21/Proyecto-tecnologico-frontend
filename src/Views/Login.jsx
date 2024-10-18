// src/Views/Login.js
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [Usuario, setUsuario] = useState('');
  const [Contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        Usuario,
        Contraseña,
      });

      // Asumiendo que el backend devuelve el token en response.data.token
      login(response.data.token);
      const decodedToken = jwtDecode(response.data.token);
      // Redireccionar al dashboard o a la ruta protegida
      if( decodedToken.IdRol == 1){
        navigate('/vistaAdministrador');
      }
      if( decodedToken.IdRol == 2){
        navigate('/vistaOperador');
      }
      if( decodedToken.IdRol == 3){
        navigate('/vistaGerente');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión', error);
      setError('Credenciales inválidas o error en el servidor.');
    }
  };

  return (
    <div className="login-container" style={{width: '310px'}}> 
      <h2>Iniciar Sesión</h2>
      
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
          <label>Contraseña:</label>
          <input
            type="password"
            value={Contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Iniciar Sesión</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};
