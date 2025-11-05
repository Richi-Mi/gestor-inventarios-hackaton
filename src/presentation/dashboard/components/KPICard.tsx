import { Paper, Typography } from '@mui/material';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  color: 'success' | 'error' | 'warning';
}

export const KPICard = ({ title, value, change, color }: KPICardProps) => {
  return (
    <Paper
      sx={{
        bgcolor: 'grey.800',
        p: 3,
        borderRadius: 1,
        border: 1,
        borderColor: 'grey.700',
      }}
    >
      <Typography variant="subtitle1" sx={{ color: 'grey.400' }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: `${color}.400` }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: `${color}.500` }}>
        {change}
      </Typography>
    </Paper>
  );
};