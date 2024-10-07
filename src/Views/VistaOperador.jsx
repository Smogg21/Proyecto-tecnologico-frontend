import { useNavigate } from "react-router-dom";

export const VistaOperador = () => {
  const navigate = useNavigate();

  const goToInventory = () => {
    navigate("/inventario");
  };
  const goToNuevoLote = () => {
    navigate("/nuevoLote");
  };

  return (
    <div>
      <button onClick={goToInventory}>Ir a Inventario</button>
      <br />
      <br />
      <button onClick={goToNuevoLote}>Registrar Nuevo Lote</button>
    </div>
  );
};
