import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MovimientosXDia } from "../Charts/MovimientosXDia";
import { SalidasXDia } from "../Charts/SalidasXDia";
import { EntradasXDia } from "../Charts/EntradasXDia";


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
      <MovimientosXDia/>
      <h3>Salidas totales por día</h3>
      <SalidasXDia/>
      <h3>Entradas totales por día</h3>
      <EntradasXDia/>
      <button onClick={handleLogout}>Cerrar Sesión</button>

    </div>
  )
}