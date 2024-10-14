/* eslint-disable react/prop-types */
// src/components/PrivateRoute.js
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const PrivateRoute = ({ children, roles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace/>;
  }

  if (roles && !roles.includes(auth.user.IdRol)) {
    return <Navigate to="/unauthorized" replace/>;
  }

  return children;
};
