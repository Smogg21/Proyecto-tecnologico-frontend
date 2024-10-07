import { useMovimientos } from '../Hooks/useMovimientos';

export const VerMovimientosInventario = () => {
  const { movimientos, error } = useMovimientos();

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <table border="1">
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
                    {new Date(item.FechaMovimiento).toLocaleDateString()}
                  </td>
                  <td>{item.Notas || 'N/A'}</td>
                  <td>{item.IdUsuario}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No hay datos disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
