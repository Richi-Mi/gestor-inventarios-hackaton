import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BubbleController, // <-- ¡ARREGLO CRÍTICO! Faltaba registrar este controlador
} from 'chart.js';
import { Typography } from '@mui/material';

// Se necesita registrar el controlador de Bubble
ChartJS.register(LinearScale, PointElement, Tooltip, Legend, BubbleController);

// --- 1. Interfaz para las props ---
// Definimos que este componente AHORA ACEPTA una prop 'data'
interface ParadoxChartProps {
  data: {
    TIENDA: string;
    ventas: number;
    inventario: number;
  }[];
}

// --- 2. El componente ahora acepta props ---
export const ParadoxChart = ({ data: propData }: ParadoxChartProps) => {
  
  // --- 3. Manejo de datos vacíos ---
  if (!propData || propData.length === 0) {
    return <Typography sx={{color: 'grey.500', height: 400, display: 'grid', placeItems: 'center'}}>No hay datos de paradoja para este año.</Typography>;
  }

  // --- 4. Datos Dinámicos (Convertir JSON a Burbujas) ---
  // ¡YA NO ES ESTÁTICO!
  const chartBubbles = propData.map(d => {
    // Definimos el color y el grupo basado en la lógica de la "paradoja"
    let backgroundColor = 'rgba(52, 211, 153, 0.7)'; // Verde (Estrella)
    let label = 'Tiendas Estrella (Eficientes)';
    
    // Lógica simple (ajustar umbrales según sea necesario)
    if (d.inventario > 6000000 && d.ventas < 2000000) { 
      backgroundColor = 'rgba(239, 68, 68, 0.7)'; // Rojo (Sobreinventario)
      label = 'Sobreinventario (Mover stock)';
    } else if (d.ventas > 3000000 && d.inventario < 6000000) {
      backgroundColor = 'rgba(234, 179, 8, 0.7)'; // Amarillo (Venta Perdida)
      label = 'Venta Perdida (Enviar stock)';
    }

    return {
      x: d.ventas,
      y: d.inventario,
      r: 8 + (d.ventas / d.inventario) * 2, // Radio simple basado en rotación
      tienda: d.TIENDA, // Guardamos el nombre para el tooltip
      backgroundColor, // Asignamos el color
      label
    };
  });

  const chartData = {
    // Agrupamos dinámicamente
    datasets: [
      {
        label: 'Sobreinventario',
        data: chartBubbles.filter(b => b.label === 'Sobreinventario (Mover stock)'),
        backgroundColor: 'rgba(239, 68, 68, 0.7)'
      },
      {
        label: 'Venta Perdida',
        data: chartBubbles.filter(b => b.label === 'Venta Perdida (Enviar stock)'),
        backgroundColor: 'rgba(234, 179, 8, 0.7)'
      },
      {
        label: 'Tiendas Estrella',
        data: chartBubbles.filter(b => b.label === 'Tiendas Estrella (Eficientes)'),
        backgroundColor: 'rgba(52, 211, 153, 0.7)'
      }
    ],
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
            // Modificado para leer la tienda desde el objeto 'raw'
            const raw = context.raw;
            return `${raw.tienda}: (Ventas: ${raw.x.toLocaleString()}, Inventario: ${raw.y.toLocaleString()})`;
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
        border: { display: false }, // <-- ARREGLO PARA LÍNEA BLANCA
      },
      x: {
        title: {
          display: true,
          text: 'Ventas (Piezas)',
          color: '#e5e7eb',
        },
        ticks: { color: '#e5e7eb' },
        grid: { color: '#374151' },
        border: { display: false }, // <-- ARREGLO PARA LÍNEA BLANCA
      },
    },
  };

  // @ts-ignore: Opciones son válidas
  return <Bubble data={chartData} options={options} />;
};
