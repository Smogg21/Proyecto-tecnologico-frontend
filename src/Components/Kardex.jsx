/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const Kardex = () => {
  const { auth } = useContext(AuthContext);
  const apiUrl = import.meta.env.VITE_API_URL
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const [kardexData, setKardexData] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados para el rango de fechas
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Estado para los datos de la gráfica
  const [chartData, setChartData] = useState([]);
  const [processedChartData, setProcessedChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [initialSaldo, setInitialSaldo] = useState(0);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Obtener la lista de productos
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/productos`, {
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

  const fetchInitialSaldo = async (productoId, start) => {
    try {
      const params = {};
      if (start) params.startDate = start.toISOString();

      const response = await axios.get(
        `${apiUrl}/api/productos/${productoId}/saldoInicial`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          params,
        }
      );
      return response.data.saldoInicial;
    } catch (error) {
      console.error('Error al obtener el saldo inicial', error);
      return 0; // Por defecto, si hay error, asumir saldo inicial 0
    }
  };

  const fetchChartData = async (productoId, start, end) => {
    setChartLoading(true);
    try {
      const params = {};
      if (start) params.startDate = start.toISOString();
      if (end) params.endDate = end.toISOString();

      console.log('Fetching Chart Data with params:', params); // Debug

      const [movimientosResponse, saldoResponse] = await Promise.all([
        axios.get(
          `${apiUrl}/api/productos/${productoId}/movimientos`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
            params,
          }
        ),
        start
          ? fetchInitialSaldo(productoId, start)
          : Promise.resolve(0),
      ]);

      const chartData = movimientosResponse.data;

      // Calcular el saldo acumulado
      let saldo = saldoResponse; // Saldo inicial
      const sortedChartData = chartData.sort(
        (a, b) => new Date(a.FechaMovimiento) - new Date(b.FechaMovimiento)
      );

      const dataWithSaldo = sortedChartData.map((data) => {
        saldo += data.Entradas - data.Salidas;
        return { ...data, Saldo: saldo };
      });

      setInitialSaldo(saldoResponse);
      setProcessedChartData(dataWithSaldo);
    } catch (error) {
      console.error('Error al obtener los datos de la gráfica', error);
      setMensaje({
        tipo: 'error',
        texto: 'Error al obtener los datos de la gráfica.',
      });
    } finally {
      setChartLoading(false);
    }
  };

  const handleProductoChange = async (event) => {
    const selectedId = event.target.value;
    setSelectedProducto(selectedId);
    setKardexData([]);
    setMensaje(null);
    setChartData([]);
    setProcessedChartData([]);

    if (selectedId) {
      fetchKardexData(selectedId, startDate, endDate);
      fetchChartData(selectedId, startDate, endDate);
    }
  };

  const fetchKardexData = async (productoId, start, end) => {
    setLoading(true);
    try {
      const params = {};
      if (start) params.startDate = start.toISOString();
      if (end) params.endDate = end.toISOString();

      console.log('Fetching Kardex Data with params:', params); // Debug

      const response = await axios.get(
        `${apiUrl}/api/productos/${productoId}/kardex`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          params,
        }
      );
      setKardexData(response.data);
      if (response.data.length === 0) {
        setMensaje({
          tipo: 'info',
          texto: 'No hay movimientos para este producto en el rango de fechas seleccionado.',
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
  };

  const handleFilter = () => {
    if (selectedProducto) {
      fetchKardexData(selectedProducto, startDate, endDate);
      fetchChartData(selectedProducto, startDate, endDate);
    }
  };

  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    if (selectedProducto) {
      fetchKardexData(selectedProducto, null, null);
      fetchChartData(selectedProducto, null, null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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

        {/* Selectores de Fecha */}
        {selectedProducto && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: isSmallScreen ? 'column' : 'row',
              gap: 2,
              mb: 2,
            }}
          >
            <DatePicker
              label="Fecha de Inicio"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <DatePicker
              label="Fecha de Fin"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleFilter}
              sx={{ alignSelf: isSmallScreen ? 'stretch' : 'flex-end' }}
            >
              Filtrar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearFilter}
              sx={{ alignSelf: isSmallScreen ? 'stretch' : 'flex-end' }}
            >
              Limpiar Filtros
            </Button>
          </Box>
        )}

        {/* Contenedor para la Tabla y la Gráfica */}
        <Grid container spacing={4}>
          {/* Tabla del KARDEX */}
          <Grid item xs={12} md={6}>
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
                sx={{ maxHeight: isSmallScreen ? 300 : 600 }}
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
                  No hay movimientos para este producto en el rango de fechas seleccionado.
                </Typography>
              )
            )}
          </Grid>

          {/* Gráfica de Movimientos */}
          <Grid item xs={12} md={6}>
            {chartLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={isSmallScreen ? 200 : 300}
              >
                <CircularProgress />
              </Box>
            ) : processedChartData.length > 0 ? (
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={processedChartData}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="FechaMovimiento" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Entradas" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="Salidas" stroke="#ff7300" />
                    <Line type="monotone" dataKey="Saldo" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            ) : selectedProducto && !chartLoading && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                No hay datos para la gráfica en el rango de fechas seleccionado.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};
