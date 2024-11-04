// Importar las librerías necesarias
import  { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function RealTimeChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();

    // Opcional: Configurar polling cada 5 segundos
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dataForChart');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="FechaMovimiento" tickFormatter={(tick) => tick.split('T')[0]}/>
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <Line type="monotone" dataKey="TotalCantidad" stroke="#8884d8" />
    </LineChart>
  );
}

export default RealTimeChart;
