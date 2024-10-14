import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext";

export const VistaAdministrador = () =>{
  const navigate = useNavigate();
  const {logout} = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate('/');
  };


  return(
    <div>
      <h1>VistaGerente</h1>
      <button onClick={() => navigate("/vistaOperador")} >
        Ir a Vista Operador
      </button>
      <br />
      <br />
      <button onClick={() => navigate("/vistaGerente")} >
        Ir a Vista Gerente
      </button>
      <br />
      <br />
      <button onClick={handleLogout}>Cerrar Sesión</button>

    </div>
  )
}