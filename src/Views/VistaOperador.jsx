import { OperadorLayout } from "../Layout/OperadorLayout";
import { Typography } from "@mui/material";
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';


export const VistaOperador = () => {
  const { auth } = useContext(AuthContext);

  const [stockStopActive, setStockStopActive] = useState(false);

useEffect(() => {
  // Obtener el estado actual de la Parada de stock
  const fetchStockStopStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stock-stop/status');
      setStockStopActive(response.data.stockStopActive);
    } catch (err) {
      console.error('Error al obtener el estado de la Parada de stock', err);
    }
  };

  fetchStockStopStatus();

  // Configurar Socket.IO para escuchar cambios
  const socket = io('http://localhost:5000', {
    auth: {
      token: localStorage.getItem('token'),
    },
  });

  socket.on('stockStopActivated', () => {
    setStockStopActive(true);
  });

  socket.on('stockStopDeactivated', () => {
    setStockStopActive(false);
  });

  return () => {
    socket.off('stockStopActivated');
    socket.off('stockStopDeactivated');
    socket.disconnect();
  };
}, []);


  return (
    <OperadorLayout >
      <Typography variant="h4" align="center" gutterBottom>
        {auth.isAuthenticated && auth.user ? `Bienvenido, operador "${auth.user.Usuario}"` : 'Bienvenido, Operador'}
      </Typography>
      {stockStopActive && (
        <Typography variant="h6" align="center" gutterBottom 
          sx={{ color: 'error.main' }}>
          ¡ATENCIÓN! La Parada de stock está activada
        </Typography>
      )}
    </OperadorLayout>
  );
};