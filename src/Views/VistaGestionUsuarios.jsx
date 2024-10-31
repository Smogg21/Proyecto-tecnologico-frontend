import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

export const VistaGestionUsuarios = () => {
  const location = useLocation();
  const mensaje = location.state?.mensaje;
  const navigate = useNavigate();

  return (
    <div>
      
      <h1>Gestion Usuarios</h1>
      
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          margin: "20px",
        }}
      >
        <button onClick={() => navigate("/nuevoUsuario")} className="button1">
          Agregar Usuario
        </button>
        <button onClick={() => navigate("/editarUsuario")} className="button1">
          Editar Usuario
        </button>
        <button
          onClick={() => navigate("/nuevaContraseña")}
          className="button1"
        >
          Cambiar contraseña a usuario
        </button>
      </div>
      <button
          onClick={() => navigate("/vistaGestionSistema")}
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
