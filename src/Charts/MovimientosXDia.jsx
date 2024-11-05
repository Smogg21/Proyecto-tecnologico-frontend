// Importar las librerías necesarias
import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client'; 
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../contexts/AuthContext';

export const MovimientosXDia = () => {
  const [data, setData] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    // Verifica si el usuario está autenticado
    if (!auth.isAuthenticated) {
      console.error('Usuario no autenticado');
      return;
    }

    // Conectar al servidor de Socket.IO con el token JWT
    const socket = io('http://localhost:5000', {
      auth: {
        token: auth.token,
      },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    // Manejo de errores de autenticación en Socket.IO
    socket.on('connect_error', (err) => {
      console.error('Error de conexión:', err.message);
    });

    // Escuchar el evento 'movimientosxdia'
    socket.on('movimientosxdia', (newData) => {
      setData(newData);
    });

    // Obtener datos iniciales
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/charts/movimientosxdia', {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Incluir el token en el encabezado
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

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      socket.disconnect();
    };
  }, [auth]); 

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis 
            dataKey="FechaMovimiento" 
            tickFormatter={(tick) => tick.split('T')[0]}
            angle={-45}
            textAnchor="end"
            interval={0} // Mostrar todas las etiquetas
            height={60}
          />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="TotalCantidad" stroke="#8884d8" name="Total Movimientos" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
