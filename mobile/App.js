import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import store from './src/store/index';
import theme from './src/theme/theme';
import AppNavigator from './src/navigation/AppNavigator';

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
