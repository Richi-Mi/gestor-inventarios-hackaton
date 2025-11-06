import { Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  color: 'success' | 'error' | 'warning';
}

export const KPICard = ({ title, value, change, color }: KPICardProps) => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        bgcolor: theme.palette.background.paper,
        p: 3,
        borderRadius: 1,
        border: 1,
        borderColor: theme.palette.divider,
      }}
    >
      <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color:
            color === 'success'
              ? theme.palette.success.main
              : color === 'error'
              ? theme.palette.error.main
              : theme.palette.warning.main,
        }}
      >
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
        {change}
      </Typography>
    </Paper>
  )
};