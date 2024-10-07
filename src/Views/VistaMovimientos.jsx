import { useNavigate } from "react-router-dom";
import {  VerMovimientosInventario } from "../Components/VerMovimientosInventario";


export const VistaMovimientos = () => {
  const navigate = useNavigate();
  const regresar = () => {
    navigate("/VistaOperador");
  };


  return (
    <div>
      <VerMovimientosInventario />
      <button onClick={regresar}>
        Regresar
      </button>

    </div>
  );
};
