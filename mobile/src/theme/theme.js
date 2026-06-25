import { MD3DarkTheme } from 'react-native-paper';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#3B82F6',
    secondary: '#F59E0B',
    background: '#0F172A',
    surface: '#1E293B',
    onSurface: '#F8FAFC',
    onBackground: '#F8FAFC',
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level2: '#1E293B',
    },
  },
};

export default theme;
