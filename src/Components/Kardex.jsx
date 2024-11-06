// src/Components/Kardex.jsx

import { useEffect, useState, useContext } from 'react';
import Select from 'react-select';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import styles from './Kardex.module.css';

export const Kardex = () => {
  const { auth } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [kardexData, setKardexData] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    // Obtener la lista de productos
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/productos', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener los productos', error);
        setMensaje({
          tipo: 'error',
          texto: 'Error al obtener los productos.',
        });
      }
    };

    fetchProductos();
  }, [auth]);

  const handleProductoChange = async (selectedOption) => {
    setSelectedProducto(selectedOption);

    if (selectedOption) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/productos/${selectedOption.value}/kardex`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setKardexData(response.data);
      } catch (error) {
        console.error('Error al obtener el KARDEX', error);
        setMensaje({
          tipo: 'error',
          texto: 'Error al obtener el KARDEX del producto.',
        });
      }
    } else {
      setKardexData([]);
    }
  };

  // Preparar opciones para el componente Select
  const opcionesProductos = productos.map((producto) => ({
    value: producto.IdProducto,
    label: producto.Nombre,
  }));

  // Estilos para el componente Select de react-select
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      marginBottom: '20px',
      backgroundColor: '#4a4a4a',
      color: 'white',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#333',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#1f8937' : state.isFocused ? '#444' : '#333',
      color: 'white',
    }),
    input: (provided) => ({
      ...provided,
      color: 'white',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'white',
    }),
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>KARDEX de Producto</h2>
      {mensaje && (
        <div
          className={mensaje.tipo === 'exito' ? styles.success : styles.error}
        >
          {mensaje.texto}
        </div>
      )}
      <Select
        options={opcionesProductos}
        value={selectedProducto}
        onChange={handleProductoChange}
        placeholder="Seleccione un producto"
        styles={customSelectStyles}
        className={styles.select}
      />
      {kardexData.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha Movimiento</th>
              <th>Tipo Movimiento</th>
              <th>Cantidad</th>
              <th>Notas</th>
              <th>Número de Serie</th>
              <th>ID Lote</th>
            </tr>
          </thead>
          <tbody>
            {kardexData.map((movimiento) => (
              <tr key={movimiento.IdMovimiento}>
                <td>
                  {new Date(movimiento.FechaMovimiento).toLocaleString()}
                </td>
                <td>{movimiento.TipoMovimiento}</td>
                <td>{movimiento.Cantidad}</td>
                <td>{movimiento.Notas}</td>
                <td>{movimiento.NumSerie || 'N/A'}</td>
                <td>{movimiento.IdLote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        selectedProducto && (
          <p className={styles.noData}>No hay movimientos para este producto.</p>
        )
      )}
    </div>
  );
};
