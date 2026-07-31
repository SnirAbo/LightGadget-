import { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Clear cart once on mount — webhook already set paymentStatus server-side.
  // This page is display only; it performs no payment verification.
  useEffect(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h2" sx={{ mb: 3 }}>
          {t('paymentSuccessMessage')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/account/orders')}
        >
          {t('viewMyOrders')}
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentSuccess;
