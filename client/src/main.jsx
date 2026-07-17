import { useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import { BrowserRouter } from 'react-router-dom';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';

import reducer from './store/rootReducer.js';
import { LanguageProvider, useLanguage } from './LanguageContext';
import createAppTheme from './theme.js';

const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [rtlPlugin] });
const cacheLtr = createCache({ key: 'muiltr' });

const loadCart = () => {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? { cart: { cart: JSON.parse(raw) } } : {};
  } catch {
    return {};
  }
};

const store = createStore(reducer, loadCart());

store.subscribe(() => {
  try {
    localStorage.setItem('cart', JSON.stringify(store.getState().cart.cart));
  } catch {
    // Quota exceeded or private browsing — ignore
  }
});

const ThemedApp = () => {
  const { lang } = useLanguage();
  const isRtl = lang === 'he';
  const theme = useMemo(() => createAppTheme(isRtl ? 'rtl' : 'ltr'), [isRtl]);

  return (
    <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <LanguageProvider>
        <ThemedApp />
      </LanguageProvider>
    </BrowserRouter>
  </Provider>
);
