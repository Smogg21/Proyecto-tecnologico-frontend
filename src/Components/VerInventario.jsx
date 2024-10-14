import { useLotes } from "../Hooks/useLotes";
// Asegúrate de ajustar la ruta donde guardes tu hook

export const VerInventario = () => {
  const { lotes, error } = useLotes();

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Id Lote</th>
              <th>Nombre</th>
              <th>Cantidad Actual</th>
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
                <td colSpan="5">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
