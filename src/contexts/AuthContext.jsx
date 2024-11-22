/* eslint-disable react/prop-types */
// src/contexts/AuthContext.js
import  { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

// Crear el contexto
export const AuthContext = createContext();

// Crear el proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      isAuthenticated: false,
      token: null,
      user: null,
    });
    delete axios.defaults.headers.common['Authorization'];
  };

  // Cargar el token desde localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          logout();
        } else {
          setAuth({
            isAuthenticated: true,
            token: token,
            user: decoded,
          });
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Opcional: Configurar un temporizador para cerrar sesión cuando el token expire
          const timeout = (decoded.exp - currentTime) * 1000;
          setTimeout(() => {
            logout();
          }, timeout);
        }
      } catch (error) {
        console.error('Token inválido', error);
        logout();
      }
    }
  }, []);

  // Función para iniciar sesión
  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setAuth({
      isAuthenticated: true,
      token: token,
      user: decoded,
    });
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log(decoded);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
