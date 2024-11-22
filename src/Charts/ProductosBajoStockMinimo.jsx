import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { AuthContext } from '../contexts/AuthContext';
import { Box, Typography, CircularProgress, useTheme, useMediaQuery } from '@mui/material';

const truncate = (input, maxLength) => {
  if (input.length > maxLength) {
    return input.substring(0, maxLength) + '...';
  }
  return input;
};

export const ProductosBajoStockMinimo = () => {
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

    // Escuchar el evento 'productosBajoStockMinimoActualizados' (si lo implementas en el backend)
    socket.on('productosBajoStockMinimoActualizados', (newData) => {
      setData(newData);
      setLoading(false);
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
        No hay productos por debajo del stock mínimo.
      </Typography>
    );
  }

  return (
    <Box width="100%" height={isSmallScreen ? 400 : 500} overflow="auto">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="Nombre" 
            angle={-45} 
            textAnchor="end" 
            interval={0} 
            height={isSmallScreen ? 80 : 100} 
            tick={{ fontSize: isSmallScreen ? 10 : 12 }}
            tickFormatter={(tick) => truncate(tick, 15)}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [value, name === 'Diferencia' ? 'Cantidad Faltante' : name]}
          />
          <Legend />
          <Bar dataKey="StockMinimo" fill="#8884d8" name="Stock Mínimo" />
          <Bar dataKey="StockActual" fill="#82ca9d" name="Stock Actual" />
          <Bar dataKey="Diferencia" fill="#FF0000" name="Cantidad Faltante" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
