/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../contexts/AuthContext';
import { Box, Typography, CircularProgress, useTheme, useMediaQuery } from '@mui/material';

const truncate = (input, maxLength) => {
  if (input.length > maxLength) {
    return input.substring(0, maxLength) + '...';
  }
  return input;
};

export const LotesActuales = () => {
  const [data, setData] = useState([]);
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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

    // Escuchar el evento 'lotesActualizados'
    socket.on('lotesActualizados', (newData) => {
      const processedData = newData.map(item => ({
        ...item,
        CantidadUsada: item.CantidadInicial - item.CantidadActual,
      }));
      setData(processedData);
      setLoading(false);
    });

    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/charts/lotesactuales`, {
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
        No hay datos disponibles para mostrar el gráfico.
      </Typography>
    );
  }

  return (
    <Box width="100%" height={isSmallScreen ? 300 : 400} overflow="auto">
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
            height={isSmallScreen ? 80 : 100} 
            tick={{ fontSize: isSmallScreen ? 10 : 12 }}
            tickFormatter={(tick) => truncate(tick, 15)}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="CantidadUsada" stackId="a" fill="#8884d8" name="Cantidad Usada" />
          <Bar dataKey="CantidadActual" stackId="a" fill="#82ca9d" name="Cantidad Actual" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
