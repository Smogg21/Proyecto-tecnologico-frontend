/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/productos`);
        const productos = response.data;

        setProductos(productos);
      } catch (error) {
        console.error("Error fetching productos:", error);
      }
    };

    fetchProductos();
  }, []);

  return productos;
};
