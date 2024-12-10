/* eslint-disable react-hooks/exhaustive-deps */
// src/Hooks/useCategorias.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useCategoriasTodas = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchCategoriasTodas = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/categoriasTodas`);
        setCategorias(response.data);
      } catch (err) {
        console.error('Error al obtener las categorías', err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Error al conectar con el servidor.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriasTodas();
  }, []);

  return { categorias, loading, error };
};
