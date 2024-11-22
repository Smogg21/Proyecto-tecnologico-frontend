import { OperadorLayout } from "../Layout/OperadorLayout";
import { Typography } from "@mui/material";
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const VistaOperador = () => {
  const { auth } = useContext(AuthContext);



  return (
    <OperadorLayout >
      <Typography variant="h4" align="center" gutterBottom>
        {auth.isAuthenticated && auth.user ? `Bienvenido, operador "${auth.user.Usuario}"` : 'Bienvenido, Operador'}
      </Typography>
      {/* Puedes agregar contenido adicional aquí */}
    </OperadorLayout>
  );
};