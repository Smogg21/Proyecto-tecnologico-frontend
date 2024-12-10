/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client'; 
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { Box, Typography, CircularProgress, useTheme, useMediaQuery } from '@mui/material';

export const SalidasXDia = () => {
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

    socket.on('salidasxdia', (newData) => {
      setData(newData);
      setLoading(false);
    });

    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/charts/salidasxdia`, {
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
        No hay datos disponibles para mostrar el gráfico.
      </Typography>
    );
  }

  return (
    <Box width="100%" height={isSmallScreen ? 300 : 400}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis 
            dataKey="FechaMovimiento" 
            tickFormatter={(tick) => {
              const date = new Date(tick);
              return date.toLocaleDateString();
            }}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(label) => `Fecha: ${format(parseISO(label), 'dd/MM/yyyy')}`}
          />
          <Line type="monotone" dataKey="TotalCantidad" stroke="#8884d8" name="Total Salidas" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
