import { MD3LightTheme } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF6B00',
    secondary: '#6B7280',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    onSurface: '#1A1A1A',
    onBackground: '#1A1A1A',
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level2: '#F8F9FA',
    },
  },
};

export default theme;
