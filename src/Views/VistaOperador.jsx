import { useNavigate } from "react-router-dom";

export const VistaOperador = () => {
  const navigate = useNavigate();

  const goToInventory = () => {
    navigate("/inventario");
  };
  const goToNuevoLote = () => {
    navigate("/nuevoLote");
  };
  const goToMovimientoInventario = () => {
    navigate("/registrarMovimiento");
  };
  const goToVerMovimientos = () => {
    navigate("/verMovimientos");
  };

  return (
    <div>
      <button onClick={goToInventory}>Ir a Inventario</button>
      <br />
      <br />
      <button onClick={goToNuevoLote}>Registrar Nuevo Lote</button>
      <br />
      <br />
      <button onClick={goToMovimientoInventario} >
        Registrar Movimiento Inventario
      </button>
      <br />
      <br />
      <button onClick={goToVerMovimientos} >
        Ver Movimiento Inventario
      </button>
    </div>
  );
};
