import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../contexts/AuthContext';
import { truncate } from '../utils/truncate';

export const ProductosBajoStockMinimo = () => {
  const [data, setData] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      console.error('Usuario no autenticado');
      return;
    }

    const socket = io('http://localhost:5000', {
      auth: {
        token: auth.token,
      },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect_error', (err) => {
      console.error('Error de conexión:', err.message);
    });

    // Escuchar el evento 'productosBajoStockMinimoActualizados' (si lo implementas en el backend)
    socket.on('productosBajoStockMinimoActualizados', (newData) => {
      setData(newData);
    });

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/charts/productosBajoStockMinimo', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    fetchData();

    return () => {
      socket.disconnect();
    };
  }, [auth]); 

  // Manejo de datos vacíos
  if (data.length === 0) {
    return <p>No hay productos por debajo del stock mínimo.</p>;
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="Nombre" 
            angle={-45} 
            textAnchor="end" 
            interval={0} 
            height={60} 
            tickFormatter={(tick) => truncate(tick, 15)} // Trunca nombres largos
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [value, name === 'Diferencia' ? 'Cantidad Faltante' : name]}
          />
          <Bar dataKey="StockMinimo" fill="#8884d8" name="Stock Mínimo" />
          <Bar dataKey="StockActual" fill="#82ca9d" name="Stock Actual" />
          <Bar dataKey="Diferencia" fill="#FF0000" name="Cantidad Faltante" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
