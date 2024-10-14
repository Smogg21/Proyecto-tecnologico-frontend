import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {jwtDecode} from 'jwt-decode';

export const Unauthorized = () => {

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    console.log(decodedToken)
  }, []);

  const navigate = useNavigate();
  const {logout} = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return(
    <div>
      <h1>Unauthorized</h1>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  )
}