import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary:   { main: '#FF6B00', dark: '#E05A00', light: '#FFF3EB', contrastText: '#FFFFFF' },
    success:   { main: '#22C55E', light: '#DCFCE7' },
    error:     { main: '#EF4444', light: '#FEE2E2' },
    warning:   { main: '#F59E0B', light: '#FEF3C7' },
    info:      { main: '#3B82F6', light: '#DBEAFE' },
    background: { default: '#FFFFFF', paper: '#F8F9FA' },
    text:      { primary: '#1A1A1A', secondary: '#6B7280', disabled: '#9CA3AF' },
    divider:   '#E5E7EB',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: `'Heebo', 'Rubik', system-ui, sans-serif`,
    h1: { fontSize: '2rem',    fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '1.5rem',  fontWeight: 700, lineHeight: 1.3 },
    h3: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: '1rem',     fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600 },
    caption: { fontSize: '0.75rem', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 24, paddingBlock: 12 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          transition: 'transform .2s, box-shadow .2s',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '&:hover': { transform: 'none' },
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
    },
  },
});

export default theme;
