/* eslint-disable react-hooks/exhaustive-deps */
// Components/NotificationListener.jsx
import { useEffect, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const NotificationListener = () => {
  const { auth } = useContext(AuthContext);
  const notifiedProductsRef = useRef({});
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (!auth.isAuthenticated) {
      console.error('Usuario no autenticado');
      return;
    }

    const socket = io(`${apiUrl}`, {
      auth: {
        token: auth.token,
      },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect_error', (err) => {
      console.error('Error de conexión:', err.message);
    });

    socket.on('productosBajoStockMinimoActualizados', (newData) => {
      if (newData.length > 0) {
        newData.forEach(product => {
          if (!notifiedProductsRef.current[product.IdProducto]) {
            notifiedProductsRef.current[product.IdProducto] = true;
            // Mostrar notificación para este producto
            toast.warn(`El producto ${product.Nombre} está bajo en stock (Stock actual: ${product.StockActual}, Stock mínimo: ${product.StockMinimo})`, {
              position: 'top-right',
              autoClose: false,
            });
          }
        });
      } else {
        // Si ya no hay productos bajo stock mínimo, reiniciar la lista
        notifiedProductsRef.current = {};
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [auth]);

  return null;
};

export default NotificationListener;
