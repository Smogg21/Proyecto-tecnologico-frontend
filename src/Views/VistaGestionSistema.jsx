import { useNavigate } from "react-router-dom";

export const VistaGestionSistema = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>VistaGestionSistema</h1>
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
        <button onClick={() => navigate("/vistaGerente")} className="button1">
          Ir a Vista Gerente
        </button>
        <button
          onClick={() => navigate("/nuevaContraseña")}
          className="button1"
        >
          Cambiar contraseña a usuario
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
