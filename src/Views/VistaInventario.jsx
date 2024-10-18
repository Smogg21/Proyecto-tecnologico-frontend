// src/Pages/VistaInventario.jsx


import { useNavigate } from "react-router-dom";
import { VerInventario } from "../Components/VerInventario";
import styles from './VistaInventario.module.css';

export const VistaInventario = () => {
  const navigate = useNavigate();

  const regresar = () => {
    navigate("/VistaOperador");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Inventario</h1>
        <button className="button2" onClick={regresar}>
          Regresar
        </button>
      </header>
      <VerInventario />
    </div>
  );
};
