import { useNavigate } from "react-router-dom";
import { VerInventario } from "../Components/VerInventario";

export const VistaInventario = () => {
  const navigate = useNavigate();
  const goToNuevoLote = () => {
    navigate("/nuevoLote");
  };
  const goToNuevoProducto = () => {
    navigate("/nuevoProducto");
  };

  const buttonStyles = {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div>
      <VerInventario />
      <button onClick={goToNuevoLote} style={buttonStyles}>
        Registrar Nuevo Lote
      </button>
      <br />
      <button onClick={goToNuevoProducto} style={buttonStyles}>
        Registrar Nuevo Producto
      </button>
    </div>
  );
};
