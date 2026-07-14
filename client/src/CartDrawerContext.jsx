import { createContext, useContext, useState } from 'react';
import { Snackbar, Button } from '@mui/material';
import { useLanguage } from './LanguageContext';

const CartDrawerContext = createContext({
  cartOpen: false,
  setCartOpen: () => {},
  showAddedToCart: () => {},
});

export const CartDrawerProvider = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(0);
  const { t } = useLanguage();

  const showAddedToCart = () => {
    setSnackbarKey((k) => k + 1);
    setSnackbarOpen(true);
  };

  return (
    <CartDrawerContext.Provider value={{ cartOpen, setCartOpen, showAddedToCart }}>
      {children}
      <Snackbar
        key={snackbarKey}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={t('addedToCart')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              setCartOpen(true);
              setSnackbarOpen(false);
            }}
          >
            {t('viewCart')}
          </Button>
        }
        sx={{ bottom: { xs: '96px', md: '24px' } }}
      />
    </CartDrawerContext.Provider>
  );
};

export const useCartDrawer = () => useContext(CartDrawerContext);
