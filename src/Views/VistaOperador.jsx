import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export const VistaOperador = () => {
  const navigate = useNavigate();
  const {logout} = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate('/');
  };


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
      <button onClick={goToInventory}>Ver Inventario</button>
      <br />
      <br />
      <button onClick={goToVerMovimientos} >
        Ver Movimiento Inventario
      </button>
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
      <button onClick={() => navigate("/nuevoProducto")} >
        Registrar Nuevo Producto
      </button>
      <br />
      <br />
      <button onClick={handleLogout}>Cerrar Sesión</button>
      
    </div>
  );
};
