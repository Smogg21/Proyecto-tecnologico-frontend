import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export const VistaAdministrador = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <h1>VistaGerente</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            margin: "20px",
            
          }}
        >
          <button onClick={() => navigate("/vistaOperador")} className="button1">
            Ir a Vista Operador
          </button>
          <button onClick={() => navigate("/vistaGerente")}  className="button1">
            Ir a Vista Gerente
          </button>
        </div>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
  );
};
