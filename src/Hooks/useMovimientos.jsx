/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useState, useEffect } from 'react';

export const useMovimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        // Aquí puedes reemplazar el JSON estático con una llamada a una API si es necesario
        const response = await axios.get(`${apiUrl}/api/movimientosInventario`);
        const data = response.data;

        setMovimientos(data);
      } catch (err) {
        setError('Error al obtener los movimientos: ' + err.message);
      }
    };

    fetchMovimientos();
  }, []);

  return { movimientos, error };
};
