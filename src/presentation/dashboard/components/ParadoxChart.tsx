import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const datasets = [
  {
    label: 'Sobreinventario (Tienda 8, 2, 5)',
    data: [
      { x: 500, y: 5000, r: 15 },
      { x: 800, y: 4500, r: 10 },
      { x: 600, y: 4000, r: 12 }
    ],
    backgroundColor: 'rgba(239, 68, 68, 0.7)'
  },
  {
    label: 'Venta Perdida (Tienda 1, 7, 9)',
    data: [
      { x: 4000, y: 1000, r: 18 },
      { x: 3800, y: 800, r: 13 },
      { x: 4200, y: 1100, r: 15 }
    ],
    backgroundColor: 'rgba(234, 179, 8, 0.7)'
  },
  {
    label: 'Tiendas Estrella (Tienda 12, 16)',
    data: [
      { x: 4500, y: 4500, r: 25 },
      { x: 4000, y: 3800, r: 20 }
    ],
    backgroundColor: 'rgba(52, 211, 153, 0.7)'
  }
];

export const ParadoxChart = () => {
  const chartData = {
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e5e7eb',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            return `${label}: (Ventas: ${context.raw.x}, Inventario: ${context.raw.y})`;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Inventario (Piezas)',
          color: '#e5e7eb',
        },
        ticks: { color: '#e5e7eb' },
        grid: { color: '#374151' },
      },
      x: {
        title: {
          display: true,
          text: 'Ventas (Piezas)',
          color: '#e5e7eb',
        },
        ticks: { color: '#e5e7eb' },
        grid: { color: '#374151' },
      },
    },
  };

  return <Bubble data={chartData} options={options} />;
};