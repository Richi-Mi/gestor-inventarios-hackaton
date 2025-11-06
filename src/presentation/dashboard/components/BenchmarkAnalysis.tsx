import React from 'react';
import { Box, Typography, Paper, styled, useTheme } from '@mui/material';
// Importamos el gráfico de Dona (Pie) de Nivo
import { ResponsivePie } from '@nivo/pie';

// --- 1. Definimos las Interfaces de Props ---
// Estas interfaces deben coincidir con las que definimos en DashboardScreen
interface BenchmarkData {
  totalTiendas: number;
  tiendasFueraRango: number;
  porcentajeFueraRango: string;
  tiendasSobreinventariadas: number;
  tiendasConVentaPerdida: number;
  rangoOptimo: string;
}

interface Props {
  data: BenchmarkData;
  diasCobertura: string;
}

// --- 2. Definimos el StyledPaper (copiado de DashboardScreen) ---
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[700]}`,
  marginBottom: theme.spacing(4), // Separación con el siguiente elemento
}));

// --- 3. Componente de Métrica Central para el Donut ---
// Esto renderiza el % en el centro del gráfico
const CenterMetric = ({ dataWithArc, centerX, centerY, data }: any) => {
  return (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        fill: useTheme().palette.error.main,
      }}
    >
      {/* Usamos el dato original 'porcentajeFueraRango' */}
      {data.porcentajeFueraRango}
    </text>
  );
};


export const BenchmarkAnalysis: React.FC<Props> = ({ data, diasCobertura }) => {
  const theme = useTheme(); // Hook para acceder al tema de MUI

  // --- 4. Preparamos los datos para el gráfico de Dona ---
  const porcentajeFuera = parseFloat(data.porcentajeFueraRango);
  const porcentajeOptimo = 100 - porcentajeFuera;

  const pieData = [
    {
      id: 'Fuera de Rango',
      label: 'Fuera de Rango',
      value: porcentajeFuera,
      color: theme.palette.error.main, // Rojo
    },
    {
      id: 'Óptimo',
      label: 'Óptimo',
      value: porcentajeOptimo,
      color: theme.palette.success.main, // Verde
    },
  ];

  return (
    <StyledPaper>
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, // Columna fija para el gráfico, flexible para el texto
          gap: 3,
          alignItems: 'center'
        }}
      >
        
        {/* --- COLUMNA 1: Gráfico de Dona --- */}
        <Box sx={{ height: 250 }}>
          <ResponsivePie
            data={pieData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.6} // Esto lo convierte en Dona
            padAngle={1}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ datum: 'data.color' }} // Usa los colores que definimos en pieData
            enableArcLabels={false} // Oculta etiquetas sobre el gráfico
            enableArcLinkLabels={false} // Oculta líneas de etiquetas
            
            // Métrica Central
            layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', 
              // Añadimos nuestra métrica personalizada
              (props) => <CenterMetric {...props} data={data} />
            ]}
           
            // Tema de Nivo para que coincida con nuestro fondo oscuro
            theme={{
              legends: {
                text: {
                  fill: theme.palette.text.primary,
                  fontSize: 12, // <-- ✅ ESTA ES LA UBICACIÓN CORRECTA
                },
              },
            }}
            
            // Leyenda
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 20,
                itemsSpacing: 20,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
              },
            ]}
          />
        </Box>

        {/* --- COLUMNA 2: Resumen y Recomendación --- */}
        <Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
            Diagnóstico de Cobertura (vs. {data.rangoOptimo} Óptimos)
          </Typography>
          
          <Typography variant="h2" component="p" sx={{ color: 'error.main', fontWeight: 'bold', mt: 1, lineHeight: 1.1 }}>
            {diasCobertura}
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.300', mb: 2 }}>
            Cobertura General Promedio (Nacional)
          </Typography>

          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            Tiendas Fuera de Rango: {data.tiendasFueraRango} de {data.totalTiendas}
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'error.light', fontWeight: 'bold' }}>
            🔴 {data.tiendasSobreinventariadas} Tiendas Sobreinventariadas ({'>'} 90 días)
          </Typography>
          <Typography variant="body1" sx={{ color: 'warning.light', fontWeight: 'bold', mb: 3 }}>
            🟡 {data.tiendasConVentaPerdida} Tiendas con Venta Perdida ({'<'} 28 días)
          </Typography>

          {/* Recomendación Estratégica (Problema de Exactitud) */}
          <Typography variant="h6" sx={{ color: 'cyan.400', mb: 1 }}>
            Recomendación: Mejorar Exactitud de Inventario
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.300' }}>
            El sobreinventario y la venta perdida a menudo se deben a una baja exactitud. 
            Se recomienda implementar <strong>conteos cíclicos</strong> semanales en tiendas clave y 
            adoptar <strong>tecnología RFID</strong> para artículos de alta rotación.
          </Typography>

        </Box>
      </Box>
    </StyledPaper>
  );
};