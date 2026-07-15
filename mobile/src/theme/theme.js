import { MD3LightTheme, configureFonts } from 'react-native-paper';

// All 15 MD3 type roles mapped to Heebo.
// Font family names match the keys registered by useFonts() in App.js.
// Size scale mirrors the web: 32 / 24 / 20 / 16 / 14 / 12
const fonts = configureFonts({
  config: {
    displayLarge:   { fontFamily: 'Heebo_700Bold',     fontSize: 57, fontWeight: '700', letterSpacing: -0.25, lineHeight: 64 },
    displayMedium:  { fontFamily: 'Heebo_700Bold',     fontSize: 45, fontWeight: '700', letterSpacing: 0,     lineHeight: 52 },
    displaySmall:   { fontFamily: 'Heebo_700Bold',     fontSize: 36, fontWeight: '700', letterSpacing: 0,     lineHeight: 44 },
    headlineLarge:  { fontFamily: 'Heebo_700Bold',     fontSize: 32, fontWeight: '700', letterSpacing: 0,     lineHeight: 40 },
    headlineMedium: { fontFamily: 'Heebo_700Bold',     fontSize: 24, fontWeight: '700', letterSpacing: 0,     lineHeight: 32 },
    headlineSmall:  { fontFamily: 'Heebo_600SemiBold', fontSize: 20, fontWeight: '600', letterSpacing: 0,     lineHeight: 28 },
    titleLarge:     { fontFamily: 'Heebo_600SemiBold', fontSize: 20, fontWeight: '600', letterSpacing: 0,     lineHeight: 28 },
    titleMedium:    { fontFamily: 'Heebo_500Medium',   fontSize: 16, fontWeight: '500', letterSpacing: 0.15,  lineHeight: 24 },
    titleSmall:     { fontFamily: 'Heebo_500Medium',   fontSize: 14, fontWeight: '500', letterSpacing: 0.1,   lineHeight: 20 },
    labelLarge:     { fontFamily: 'Heebo_500Medium',   fontSize: 14, fontWeight: '500', letterSpacing: 0.1,   lineHeight: 20 },
    labelMedium:    { fontFamily: 'Heebo_500Medium',   fontSize: 12, fontWeight: '500', letterSpacing: 0.5,   lineHeight: 16 },
    labelSmall:     { fontFamily: 'Heebo_500Medium',   fontSize: 12, fontWeight: '500', letterSpacing: 0.5,   lineHeight: 16 },
    bodyLarge:      { fontFamily: 'Heebo_400Regular',  fontSize: 16, fontWeight: '400', letterSpacing: 0.15,  lineHeight: 26 },
    bodyMedium:     { fontFamily: 'Heebo_400Regular',  fontSize: 14, fontWeight: '400', letterSpacing: 0.25,  lineHeight: 21 },
    bodySmall:      { fontFamily: 'Heebo_400Regular',  fontSize: 12, fontWeight: '400', letterSpacing: 0.4,   lineHeight: 16 },
  },
});

const theme = {
  ...MD3LightTheme,
  // roundness: 4 is already the MD3LightTheme default; explicit here for clarity.
  // Card:  3 × 4 = 12px ✓   Sheet: 4 × 4 = 16px ✓
  // Button: 5 × 4 = 20px — overridden per component when built.
  roundness: 4,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary:          '#FF6B00',
    onPrimary:        '#FFFFFF',
    secondary:        '#6B7280',
    background:       '#FFFFFF',
    surface:          '#F8F9FA',
    outline:          '#E5E7EB',
    onSurface:        '#1A1A1A',
    onSurfaceVariant: '#6B7280',
    onBackground:     '#1A1A1A',
    error:              '#EF4444',
    errorContainer:     '#FEE2E2',
    onErrorContainer:   '#EF4444',
    successContainer:   '#DCFCE7',
    onSuccessContainer: '#22C55E',
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level2: '#F8F9FA',
    },
  },
};

export default theme;
