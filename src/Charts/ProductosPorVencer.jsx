import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { AuthContext } from '../contexts/AuthContext';

export const ProductosPorVencer = () => {
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

    // Escuchar el evento 'productosPorVencerActualizados' (si lo implementas en el backend)
    socket.on('productosPorVencerActualizados', (newData) => {
      setData(newData);
    });

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/charts/productosPorVencer', {
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

  return (
    <div style={{ overflowX: 'scroll' }}>
      <BarChart 
        width={Math.max(600, data.length * 80)} 
        height={400} 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        layout="vertical" // Gráfica de barras horizontal
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number"  />
        <YAxis 
          type="category" 
          dataKey="NombreProductoLote" 
          width={150} 
          tick={{ fontSize: 12 }}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="DiasParaVencer" fill="#FF8042" name="Días para vencer" />
      </BarChart>
    </div>
  );
}
