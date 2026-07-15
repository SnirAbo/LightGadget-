import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Heebo_400Regular,
  Heebo_500Medium,
  Heebo_600SemiBold,
  Heebo_700Bold,
} from '@expo-google-fonts/heebo';
import store from './src/store/index';
import theme from './src/theme/theme';
import AppNavigator from './src/navigation/AppNavigator';

// Keep splash visible until fonts are ready.
SplashScreen.preventAutoHideAsync();

function AuthRestore({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const restore = async () => {
      const userJson = await SecureStore.getItemAsync('user');
      if (userJson) {
        dispatch({ type: 'LOGIN_USER', payload: JSON.parse(userJson) });
      }
    };
    restore();
  }, []);

  return children;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Heebo_400Regular,
    Heebo_500Medium,
    Heebo_600SemiBold,
    Heebo_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Hold render until fonts are ready (or failed — fontError lets the app
  // proceed with system font fallback rather than hanging indefinitely).
  if (!fontsLoaded && !fontError) return null;

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <AuthRestore>
          <AppNavigator />
        </AuthRestore>
      </PaperProvider>
    </ReduxProvider>
  );
}
