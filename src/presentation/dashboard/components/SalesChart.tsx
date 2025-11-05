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

const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const data = [209, 244, 304, 245, 260, 256, 273, 332, 267, 313, 341, 541];

export const SalesChart = () => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Ventas (Pzs) 2024',
        data,
        borderColor: 'rgb(52, 211, 153)',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb',
        },
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

  return <Line data={chartData} options={options} />;
};