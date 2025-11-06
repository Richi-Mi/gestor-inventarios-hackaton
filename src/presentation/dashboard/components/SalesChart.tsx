import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Typography } from '@mui/material'; // Importar Typography para el mensaje
import { useTheme } from '@mui/material/styles';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- 1. Interfaz para las props ---
// Definimos que este componente AHORA ACEPTA una prop 'data'
interface SalesChartProps {
  data: {
    mes?: string; // Hacemos opcionales por si acaso
    ventas?: number;
  }[];
}

// --- 2. El componente ahora acepta props ---
export const SalesChart = ({ data: propData }: SalesChartProps) => {
  
  // --- 3. Manejo de datos vacíos ---
  if (!propData || propData.length === 0 || propData.every(d => d.ventas === 0)) {
    return <Typography sx={{color: 'grey.500', height: 300, display: 'grid', placeItems: 'center'}}>No hay datos de ventas para este año.</Typography>;
  }

  // --- 4. Datos dinámicos basados en props ---
  const labels = propData.map(d => d.mes || 'N/A');
  const data = propData.map(d => d.ventas || 0);

  const theme = useTheme()

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Ventas (Pzs)', // Label genérico
        data,
        borderColor: theme.palette.info.main,
        backgroundColor: `${theme.palette.info.main}22`,
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme.palette.text.primary,
        },
      },
    },
    scales: {
      y: {
        ticks: { color: theme.palette.text.primary },
        grid: { color: theme.palette.divider },
        border: { display: false }, // <-- ARREGLO PARA LÍNEA BLANCA
      },
      x: {
        ticks: { color: theme.palette.text.primary },
        grid: { color: theme.palette.divider },
        border: { display: false }, // <-- ARREGLO PARA LÍNEA BLANCA
      },
    },
  };
  
  // @ts-ignore: Opciones son válidas
  return <Line data={chartData} options={options} />;
};
