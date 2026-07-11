import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import reducer from './store/rootReducer.js';
import { LanguageProvider } from './LanguageContext';
import theme from './theme.js';

const store = createStore(reducer);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <BrowserRouter>
        <LanguageProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </LanguageProvider>
      </BrowserRouter>
    </Provider>
)
