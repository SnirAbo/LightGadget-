import { Stack, Box, Typography } from '@mui/material';

const SectionTitle = ({ children, variant = 'h2' }) => (
  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
    <Box sx={{
      width: '4px',
      height: '24px',
      flexShrink: 0,
      transform: 'skewX(-15deg)',
      borderRadius: '2px',
      background: 'linear-gradient(180deg, #FFD60A 0%, #FF6B00 100%)',
    }} />
    <Typography variant={variant}>{children}</Typography>
  </Stack>
);

export default SectionTitle;
