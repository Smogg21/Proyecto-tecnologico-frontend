// src/Components/Kardex.jsx

import { useEffect, useState, useContext } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

export const Kardex = () => {
  const { auth } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const [kardexData, setKardexData] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Obtener la lista de productos
    const fetchProductos = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [auth]);

  const handleProductoChange = async (event) => {
    const selectedId = event.target.value;
    setSelectedProducto(selectedId);
    setKardexData([]);
    setMensaje(null);

    if (selectedId) {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/productos/${selectedId}/kardex`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setKardexData(response.data);
        if (response.data.length === 0) {
          setMensaje({
            tipo: 'info',
            texto: 'No hay movimientos para este producto.',
          });
        }
      } catch (error) {
        console.error('Error al obtener el KARDEX', error);
        setMensaje({
          tipo: 'error',
          texto: 'Error al obtener el KARDEX del producto.',
        });
      } finally {
        setLoading(false);
      }
    } else {
      setKardexData([]);
      setMensaje(null);
    }
  };

  return (
    <Box sx={{ p: isSmallScreen ? 1 : 3 }}>
      <Typography variant={isSmallScreen ? 'h5' : 'h4'} gutterBottom>
        KARDEX de Producto
      </Typography>
      {mensaje && (
        <Alert severity={mensaje.tipo} sx={{ mb: 2 }}>
          {mensaje.texto}
        </Alert>
      )}
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel id="select-producto-label">Seleccione un producto</InputLabel>
        <Select
          labelId="select-producto-label"
          id="select-producto"
          value={selectedProducto}
          onChange={handleProductoChange}
          label="Seleccione un producto"
        >
          <MenuItem value="">
            <em>Ninguno</em>
          </MenuItem>
          {productos.map((producto) => (
            <MenuItem key={producto.IdProducto} value={producto.IdProducto}>
              {producto.Nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={isSmallScreen ? 200 : 300}
        >
          <CircularProgress />
        </Box>
      ) : kardexData.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: isSmallScreen ? 300 : 600, mt: 2 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Fecha Movimiento</TableCell>
                <TableCell>Tipo Movimiento</TableCell>
                <TableCell>Cantidad</TableCell>
                {!isSmallScreen && <TableCell>Notas</TableCell>}
                {!isSmallScreen && <TableCell>Número de Serie</TableCell>}
                <TableCell>ID Lote</TableCell>
                <TableCell>Saldo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kardexData.map((movimiento) => (
                <TableRow key={movimiento.IdMovimiento}>
                  <TableCell>
                    {new Date(movimiento.FechaMovimiento).toLocaleString()}
                  </TableCell>
                  <TableCell>{movimiento.TipoMovimiento}</TableCell>
                  <TableCell>{movimiento.Cantidad}</TableCell>
                  {!isSmallScreen && <TableCell>{movimiento.Notas}</TableCell>}
                  {!isSmallScreen && (
                    <TableCell>{movimiento.NumSerie || 'N/A'}</TableCell>
                  )}
                  <TableCell>{movimiento.IdLote}</TableCell>
                  <TableCell>{movimiento.Saldo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        selectedProducto &&
        !loading && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No hay movimientos para este producto.
          </Typography>
        )
      )}
    </Box>
  );
};
