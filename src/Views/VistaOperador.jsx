import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import NotificationListener from "../Components/NotificationListener";

export const VistaOperador = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate("/");
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
      <NotificationListener />

      <h1>Vista operador</h1>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            margin: "20px",
          }}
        >
          <button onClick={goToInventory} className="button1">
            Ver Inventario
          </button>
          <button onClick={goToVerMovimientos} className="button1">
            Ver Movimiento Inventario
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            margin: "20px",
          }}
        >
          <button onClick={goToNuevoLote} className="button2">
            Registrar Nuevo Lote
          </button>

          <button onClick={goToMovimientoInventario} className="button2">
            Registrar Movimiento Inventario
          </button>

          <button
            onClick={() => navigate("/nuevoProducto")}
            className="button2"
          >
            Registrar Nuevo Producto
          </button>
        </div>
      </div>
      <button onClick={handleLogout} style={{ marginTop: "10px" }}>
        Cerrar Sesión
      </button>
    </div>
  );
};
