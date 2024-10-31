import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

export const VistaGestionSistema = () => {
  const location = useLocation();
  const mensaje = location.state?.mensaje;
  const navigate = useNavigate();

  return (
    <div>
      <h1>Gestion del Sistema</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          margin: "20px",
        }}
      >
        <button onClick={() => navigate("/nuevaCategoria")} className="button1">
          Agregar categoria
        </button>
        <button onClick={() => navigate("/editarCategoria")} className="button1">
          Editar categoria
        </button>
        <button
          onClick={() => navigate("/vistaGestionUsuarios")}
          className="button1"
        >
          Ir a gestion de usuarios
        </button>
      </div>
      <button
          onClick={() => navigate("/vistaAdministrador")}
        >
          Regresar
        </button>

        {mensaje && (
        <div
          style={{
            padding: "10px",
            marginTop: "15px",
            marginBottom: "15px",
            color: mensaje.tipo === "exito" ? "green" : "red",
            border: `1px solid ${mensaje.tipo === "exito" ? "green" : "red"}`,
            borderRadius: "4px",
            backgroundColor: mensaje.tipo === "exito" ? "#d4edda" : "#f8d7da",
          }}
        >
          {mensaje.texto}
        </div>
      )}
    </div>
  );
};
