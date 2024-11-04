// src/Components/VerInventario.jsx


import { useLotes } from "../Hooks/useLotes";
import styles from './VerInventario.module.css';

export const VerInventario = () => {
  const { lotes, error } = useLotes();

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!lotes) {
    return <p className={styles.loading}>Cargando...</p>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Id Lote</th>
            <th>Nombre</th>
            <th>Cantidad Actual</th>
            <th>Cantidad Inicial</th>
            <th>Fecha de Caducidad</th>
            <th>Fecha de Entrada Inicial</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(lotes) && lotes.length > 0 ? (
            lotes.map((item) => (
              <tr key={item.IdLote}>
                <td>{item.IdLote}</td>
                <td>{item.Nombre}</td>
                <td>{item.CantidadActual}</td>
                <td>{item.CantidadInicial}</td>
                <td>
                  {item.FechaCaducidad
                    ? new Date(item.FechaCaducidad).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{new Date(item.FechaEntrada).toLocaleString()}</td>
                <td>{item.IdUsuario}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={styles.noData}>
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
