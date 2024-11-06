import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MovimientosXDia } from "../Charts/MovimientosXDia";
import { SalidasXDia } from "../Charts/SalidasXDia";
import { EntradasXDia } from "../Charts/EntradasXDia";
import { LotesActuales } from "../Charts/LotesActuales";
import { ProductosPorVencer } from "../Charts/ProductosPorVencer";
import { ProductosBajoStockMinimo } from "../Charts/ProductosBajoStockMinimo";
import { Kardex } from "../Components/Kardex";



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
      <Kardex/>
      <h3>Movimientos totales por día</h3>
      <MovimientosXDia/>
      <h3>Salidas totales por día</h3>
      <SalidasXDia/>
      <h3>Entradas totales por día</h3>
      <EntradasXDia/>
      <h3>Lotes actuales</h3>
      <LotesActuales/>
      <h3>Productos por vencer</h3>
      <ProductosPorVencer/>
      <h3>Productos bajo stock mínimo</h3>
      <ProductosBajoStockMinimo/>

      <button onClick={handleLogout}>Cerrar Sesión</button>

    </div>
  )
}