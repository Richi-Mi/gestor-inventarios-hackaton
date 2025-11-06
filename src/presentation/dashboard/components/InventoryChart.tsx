import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Colores estáticos (como en tu archivo original)
const backgroundColors = [
  'rgb(239, 68, 68)',
  'rgb(248, 113, 113)',
  'rgb(252, 165, 165)',
  'rgb(254, 202, 202)',
  'rgb(254, 226, 226)'
];

// --- 1. Interfaz para las props ---
// Definimos que este componente AHORA ACEPTA una prop 'data'
interface InventoryChartProps {
  data: {
    tienda?: string;
    inventario?: number;
  }[];
}

// --- 2. El componente ahora acepta props ---
export const InventoryChart = ({ data: propData }: InventoryChartProps) => {

  // --- 3. Manejo de datos vacíos ---
  if (!propData || propData.length === 0) {
    return <Typography sx={{color: 'grey.500', height: 300, display: 'grid', placeItems: 'center'}}>No hay datos de inventario para este año.</Typography>;
  }

  // --- 4. Datos dinámicos basados en props ---
  const theme = useTheme()

  const labels = propData.map(d => d.tienda || 'N/A');
  const data = propData.map(d => d.inventario || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Inventario Actual (Pzs)',
        data,
        backgroundColor: backgroundColors.slice(0, data.length), // Asegura que los colores coincidan
        borderColor: theme.palette.divider,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
  return <Bar data={chartData} options={options} />;
};
