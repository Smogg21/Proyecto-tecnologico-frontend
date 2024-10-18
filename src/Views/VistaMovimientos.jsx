// src/Pages/VistaMovimientos.jsx

import { useNavigate } from "react-router-dom";
import { VerMovimientosInventario } from "../Components/VerMovimientosInventario";
import styles from './VistaMovimientos.module.css';

export const VistaMovimientos = () => {
  const navigate = useNavigate();

  const regresar = () => {
    navigate("/VistaOperador");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Movimientos de Inventario</h1>
        <button className="button2" onClick={regresar}>
          Regresar
        </button>
      </header>
      <VerMovimientosInventario />
    </div>
  );
};
