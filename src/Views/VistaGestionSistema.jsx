import { useNavigate } from "react-router-dom";

export const VistaGestionSistema = () => {
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
        <button onClick={() => navigate("/vistaOperador")} className="button1">
          Agregar categoria
        </button>
        <button onClick={() => navigate("/vistaGerente")} className="button1">
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
    </div>
  );
};
