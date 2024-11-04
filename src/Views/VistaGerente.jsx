import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import RealTimeChart from "../Charts/MovimientosXDia";

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
      <h3>Movimientos totales por día</h3>
      <RealTimeChart/>
      <button onClick={handleLogout}>Cerrar Sesión</button>

    </div>
  )
}