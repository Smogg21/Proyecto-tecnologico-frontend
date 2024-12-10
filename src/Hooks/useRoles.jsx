/* eslint-disable react-hooks/exhaustive-deps */
// src/Hooks/useRoles.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/roles`);
        setRoles(response.data);
      } catch (err) {
        console.error('Error al obtener los roles', err);
        // Verificar si el error tiene una respuesta del servidor
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Error al conectar con el servidor.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { roles, loading, error };
};
