import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { AuthContext } from '../contexts/AuthContext';
import { Box, Typography, CircularProgress, useTheme, useMediaQuery } from '@mui/material';

export const ProductosPorVencer = () => {
  const [data, setData] = useState([]);
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
      setLoading(false);
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      socket.disconnect();
    };
  }, [auth]); 

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={isSmallScreen ? 300 : 400}>
        <CircularProgress />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Typography variant="body1">
        No hay productos por vencer.
      </Typography>
    );
  }

  return (
    <Box width="100%" height={isSmallScreen ? 400 : 500} overflow="auto">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          layout={isSmallScreen ? 'vertical' : 'horizontal'}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {isSmallScreen ? (
            <>
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="NombreProductoLote" 
                width={150} 
                tick={{ fontSize: 12 }}
              />
            </>
          ) : (
            <>
              <XAxis 
                dataKey="NombreProductoLote" 
                angle={-45} 
                textAnchor="end" 
                height={100} 
                tick={{ fontSize: 12 }}
                tickFormatter={(tick) => (tick.length > 15 ? `${tick.substring(0, 15)}...` : tick)}
              />
              <YAxis />
            </>
          )}
          <Tooltip />
          {!isSmallScreen && <Legend />}
          <Bar dataKey="DiasParaVencer" fill="#FF8042" name="Días para vencer" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
