// src/Hooks/useCategorias.js
import { useState, useEffect } from "react";

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categorias");
        if (response.ok) {
          const data = await response.json();
          setCategorias(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Error al obtener las categorías.");
        }
      } catch {
        setError("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, loading, error };
};
