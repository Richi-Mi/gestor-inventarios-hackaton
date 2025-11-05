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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labels = ['Tienda 12', 'Tienda 8', 'Tienda 16', 'Tienda 2', 'Tienda 5'];
const data = [120500, 95000, 89000, 75000, 72000];
const backgroundColors = [
  'rgb(239, 68, 68)',
  'rgb(248, 113, 113)',
  'rgb(252, 165, 165)',
  'rgb(254, 202, 202)',
  'rgb(254, 226, 226)'
];

export const InventoryChart = () => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Inventario Actual (Pzs)',
        data,
        backgroundColor: backgroundColors,
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: { color: '#e5e7eb' },
        grid: { color: '#374151' },
      },
      x: {
        ticks: { color: '#e5e7eb' },
        grid: { color: '#374151' },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};