import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Cart is NOT cleared — customer can return and try again.

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
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h2" sx={{ mb: 3 }}>
          {t('paymentFailedMessage')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/payment')}
        >
          {t('backToPayment')}
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentFailed;
