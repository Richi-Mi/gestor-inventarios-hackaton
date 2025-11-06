// IMPORT CORREGIDO: sólo ResponsiveLine (sin intentar importar 'Serie')
import { ResponsiveLine } from '@nivo/line';
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

// ---- Tipo local para la serie de Nivo (evita depender de tipos internos de la librería) ----
export type NivoPoint = {
  x: string | number;
  y: number;
  // puedes añadir campos extra que uses en tooltip (inventario, rotacion, mes, etc.)
  [key: string]: any;
};

export type NivoSerie = {
  id: string | number;
  data: NivoPoint[];
};

// Props del componente
interface Props {
  data: NivoSerie[];             // recibimos ya las series formateadas para Nivo
  highlightYear?: number;        // opcional, para resaltar 2026 por ejemplo
}

export const InventoryEvolutionChart: React.FC<Props> = ({ data, highlightYear }) => {
  const theme = useTheme();

  // Ejemplo: línea objetivo (50 días) - usamos valores relativos a la escala del gráfico
  const goalY = 50;

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 60, bottom: 80, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false, reverse: false }}
        axisBottom={{
          tickRotation: -45,
          legend: 'Periodo',
          legendPosition: 'middle',
          legendOffset: 65,
        }}
        axisLeft={{
          legend: 'Días de Cobertura',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        colors={[theme.palette.success.main]}
        pointSize={8}
        pointBorderWidth={2}
        useMesh={true}
        // Tooltip: tipado seguro con 'any' para evitar el error "binding element implicitly has any type"
        tooltip={({ point }: any) => (
          <Box sx={{ bgcolor: theme.palette.grey[800], p: 1, borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
              Periodo: {point.data.x}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.success.light }}>
              Días Cobertura: {Number(point.data.y).toFixed(1)} días
            </Typography>
            {point.data.inventario !== undefined && (
              <Typography variant="body2" sx={{ color: 'grey.300' }}>
                Inventario: {point.data.inventario}
              </Typography>
            )}
          </Box>
        )}
        // Ejemplo simple de layers (no uses tipos específicos aquí)
        layers={['grid', 'lines', 'points', 'areas', 'crosshair', 'mesh', 'legends']}
      />
    </Box>
  );
};
