/* eslint-disable react/prop-types */
// src/components/PublicRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export const PublicRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    return children;
  } else {
    // Asegurarse de que IdRol es un número
    const userRoleId = Number(auth.user.IdRol);

    // Redirigir según el rol del usuario
    if (userRoleId === 1 ) {
      return <Navigate to="/vistaAdministrador" replace />;
    } else if (userRoleId === 2) {
      return <Navigate to="/vistaOperador" replace />;
    } else if (userRoleId === 3) {
      // Redirigir a una ruta por defecto o mostrar un error si el rol no es reconocido
      return <Navigate to="/vistaGerente" replace />;
    }
  }
};
