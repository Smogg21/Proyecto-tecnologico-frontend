// src/Components/VerMovimientosInventario.jsx

import { useMovimientos } from '../Hooks/useMovimientos';
import styles from './VerMovimientosInventario.module.css';

export const VerMovimientosInventario = () => {
  const { movimientos, error } = useMovimientos();

  return (
    <div className={styles.tableContainer}>
      {error ? (
        <p className={styles.error} role="alert">{error}</p>
      ) : (
        <table className={styles.table} aria-label="Movimientos de Inventario">
          <thead>
            <tr>
              <th>Id Movimiento</th>
              <th>Id Lote</th>
              <th>Producto</th>
              <th>Tipo Movimiento</th>
              <th>Cantidad</th>
              <th>Fecha Movimiento</th>
              <th>Notas</th>
              <th>Id Usuario</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(movimientos) && movimientos.length > 0 ? (
              movimientos.map((item) => (
                <tr key={item.IdMovimiento}>
                  <td>{item.IdMovimiento}</td>
                  <td>{item.IdLote}</td>
                  <td>{item.Nombre}</td>
                  <td>{item.TipoMovimiento}</td>
                  <td>{item.Cantidad}</td>
                  <td>
                    {new Date(item.FechaMovimiento).toLocaleString()}
                  </td>
                  <td>{item.Notas || 'N/A'}</td>
                  <td>{item.IdUsuario}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={styles.noData}>
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
