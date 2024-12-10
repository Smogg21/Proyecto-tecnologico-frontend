/* eslint-disable react-hooks/exhaustive-deps */
// src/Hooks/useUsuarios.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [errorUsuarios, setErrorUsuarios] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/usuarios`);
        setUsuarios(response.data);
      } catch (err) {
        console.error('Error al obtener los usuarios', err);
        if (err.response && err.response.data && err.response.data.message) {
          setErrorUsuarios(err.response.data.message);
        } else {
          setErrorUsuarios("Error al conectar con el servidor.");
        }
      } finally {
        setLoadingUsuarios(false);
      }
    };

    fetchUsuarios();
  }, []);

  return { usuarios, loadingUsuarios, errorUsuarios };
};
