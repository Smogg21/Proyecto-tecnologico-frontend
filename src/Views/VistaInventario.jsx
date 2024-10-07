import { useNavigate } from "react-router-dom";
import { VerInventario } from "../Components/VerInventario"

export const VistaInventario = () => {
  const navigate = useNavigate();
  const goToNuevoLote = () => {
    navigate('/nuevoLote');
  };

  return (
    <div>
      <VerInventario/>
      <button onClick={goToNuevoLote}>Registrar Nuevo Lote</button>
    </div>
  )
}	