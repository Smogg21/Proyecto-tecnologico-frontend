// src/Hooks/useCategorias.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categorias");
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

    fetchCategorias();
  }, []);

  return { categorias, loading, error };
};
