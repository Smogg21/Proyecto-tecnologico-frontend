import { useNavigate } from "react-router-dom";
import { VerInventario } from "../Components/VerInventario";

export const VistaInventario = () => {
  const navigate = useNavigate();
  const regresar = () => {
    navigate("/VistaOperador");
  };

  return (
    <div>
      <VerInventario />
      <button onClick={regresar} >
        Regresar
      </button>
    </div>
  );
};
