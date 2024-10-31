import { useNavigate } from "react-router-dom";

export const VistaGestionUsuarios = () => {
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
        <button onClick={() => navigate("/vistaGerente")} className="button1">
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
    </div>
  );
};
