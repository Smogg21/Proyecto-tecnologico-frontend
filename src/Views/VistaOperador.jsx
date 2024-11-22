
import { OperadorLayout } from "../Layout/OperadorLayout";
import { Typography } from "@mui/material";

export const VistaOperador = () => {
  const toggleColorMode = () => {
    // Implementación de cambio de tema si aplica
  };

  return (
    <OperadorLayout toggleColorMode={toggleColorMode}>
      <Typography variant="h4" align="center" gutterBottom>
        Bienvenido a la Vista Operador
      </Typography>
      {/* Puedes agregar contenido adicional aquí */}
    </OperadorLayout>
  );
};