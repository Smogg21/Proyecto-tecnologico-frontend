import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { AuthContext } from '../contexts/AuthContext';

const truncate = (input, maxLength) => {
  if (input.length > maxLength) {
    return input.substring(0, maxLength) + '...';
  }
  return input;
};

export const LotesActuales = () => {
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

    // Escuchar el evento 'lotesActualizados'
    socket.on('lotesActualizados', (newData) => {
      const processedData = newData.map(item => ({
        ...item,
        CantidadUsada: item.CantidadInicial - item.CantidadActual,
      }));
      setData(processedData);
    });

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/charts/lotesactuales', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const jsonData = await response.json();

        const processedData = jsonData.map(item => ({
          ...item,
          CantidadUsada: item.CantidadInicial - item.CantidadActual,
        }));
        setData(processedData);
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
        width={Math.max(600, data.length * 80)} // Ajusta el ancho dinámicamente
        height={400} 
        data={data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 100 }} // Aumenta el margen inferior para etiquetas rotadas
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="Nombre" 
          angle={-45} 
          textAnchor="end" 
          height={100} 
          tick={{ fontSize: 12 }}
          tickFormatter={(tick) => truncate(tick, 15)} // Trunca nombres largos a 15 caracteres
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="CantidadUsada" stackId="a" fill="#8884d8" name="Cantidad Usada" />
        <Bar dataKey="CantidadActual" stackId="a" fill="#82ca9d" name="Cantidad Actual" />
      </BarChart>
    </div>
  );
}
