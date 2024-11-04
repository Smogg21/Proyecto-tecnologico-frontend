import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import RealTimeChart from "../Charts/RealTimeChart";

export const VistaGerente = () =>{
  const navigate = useNavigate();
  const {logout} = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return(
    <div>
      <h1>VistaGerente</h1>

      <RealTimeChart/>
      <button onClick={handleLogout}>Cerrar Sesión</button>

    </div>
  )
}