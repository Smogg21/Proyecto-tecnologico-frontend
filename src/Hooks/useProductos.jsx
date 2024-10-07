import axios from "axios";
import { useEffect, useState } from "react";

export const useProductos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/productos");
        const productos = response.data;

        // Extraer los nombres de los productos
        const nombresProductos = productos.map((producto) => ({
          IdProducto: producto.IdProducto,
          Nombre: producto.Nombre,
        }));

        setProductos(nombresProductos);
      } catch (error) {
        console.error("Error fetching productos:", error);
      }
    };

    fetchProductos();
  }, []);

  return productos;
};
