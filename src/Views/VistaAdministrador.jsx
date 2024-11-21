import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Box, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

// eslint-disable-next-line react/prop-types
export const VistaAdministrador = ({ toggleColorMode }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      {/* Botón para alternar el modo */}
      <Box alignSelf="flex-end">
        <IconButton onClick={toggleColorMode} color="inherit">
          {/* Muestra el icono basado en el tema actual */}
          {localStorage.getItem("theme") === "dark" ? (
            <Brightness7 />
          ) : (
            <Brightness4 />
          )}
        </IconButton>
      </Box>
      <div>
        <h1>VistaAdministrador</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            margin: "20px",
          }}
        >
          <button
            onClick={() => navigate("/vistaOperador")}
            className="button1"
          >
            Ir a Vista Operador
          </button>
          <button onClick={() => navigate("/vistaGerente")} className="button1">
            Ir a Vista Gerente
          </button>
          <button
            onClick={() => navigate("/vistaGestionSistema")}
            className="button1"
          >
            Ir a gestion del sistema
          </button>
        </div>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </Box>
  );
};
