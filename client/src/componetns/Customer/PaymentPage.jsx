import { Box, Typography, Button, Divider, Stack, TextField, ToggleButton, ToggleButtonGroup, Grid, Alert } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api';
import { useLanguage } from '../../LanguageContext';

const SHIPPING_FREE = 'free';
const SHIPPING_PAID = 'paid';
const SHIPPING_COST = 60;

const PaymentPage = () => {
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    phoneNumber: '',

  });
  const [shippingOption, setShippingOption] = useState(SHIPPING_FREE);
  const [validationError, setValidationError] = useState('');
  const [orderError, setOrderError] = useState('');

  const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingOption === SHIPPING_PAID ? SHIPPING_COST : 0;
  const grandTotal = itemsTotal + shippingCost;

  useEffect(() => {
    if (!user) navigate('/login');
    else if (cart.length === 0) navigate('/');
  }, []);

  if (!user || cart.length === 0) return null;

  const completeOrder = async () => {
    await api.post('/orders', {
      user: user._id,
      items: cart.map((product) => ({
      product: product._id,
      title: product.title,
      price: product.price,
     quantity: product.quantity,
     })),
    ...address,      
    shippingCost,
    totalPrice: grandTotal,
    });
  };

  const handleAddressChange = (e) => {
  setAddress((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

// const handleAddressSubmit = async (e) => {
//   e.preventDefault();
//   if (!address.city || !address.address || !address.postalCode || !address.phoneNumber) {
//     alert('אנא מלא את כל השדות');
//     return;
//   }
//   await completeOrder();
//   alert('הזמנה הושלמה בהצלחה!');
//   navigate('/account/orders');
// }

  const buildWaText = () => {
    const itemLines = cart.map(p => `${p.title} × ${p.quantity} = ₪${p.price * p.quantity}`).join('\n');
    const shippingLine = shippingCost > 0 ? `\nמשלוח: ₪${shippingCost}` : '\nמשלוח: חינם';
    const cityLine = address.city ? `\nעיר: ${address.city}` : '';
    return `🛒 הזמנה חדשה!\nשם: ${user.firstName} ${user.lastName}${cityLine}\nפריטים:\n${itemLines}${shippingLine}\nסה״כ: ₪${grandTotal}\nאנא אשר את ההזמנה 🙏`;
  };

  const handleBit = async () => {
    setValidationError('');
    setOrderError('');
    if (!address.address || !address.city || !address.postalCode || !address.phoneNumber) {
      setValidationError(t('fillShippingDetails'));
      return;
    }
    try {
      await completeOrder();
      dispatch({ type: 'CLEAR_CART' });
      window.open(`https://pay.bit.co.il/pay?phoneNumber=0538280217&amount=${grandTotal}`, '_blank');
      window.open(`https://wa.me/972538280217?text=${encodeURIComponent(buildWaText())}`, '_blank');
      navigate('/account/orders');
    } catch {
      setOrderError(t('errorSubmittingOrder'));
    }
  };

  const handlePayLater = async () => {
    setValidationError('');
    setOrderError('');
    if (!address.address || !address.city || !address.postalCode || !address.phoneNumber) {
      setValidationError(t('fillShippingDetails'));
      return;
    }
    try {
      await completeOrder();
      dispatch({ type: 'CLEAR_CART' });
      window.open(`https://wa.me/972538280217?text=${encodeURIComponent(buildWaText())}`, '_blank');
      navigate('/account/orders');
    } catch {
      setOrderError(t('errorSubmittingOrder'));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', pt: 6, px: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
          סיכום הזמנה
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
          בחר אמצעי תשלום להשלמת ההזמנה
        </Typography>

        {/* Order items */}
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 2, mb: 3 }}>
          {cart.map((item) => (
            <Box key={item._id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } }}>
              <Box
                component="img"
                src={item.pic || 'https://placehold.co/60x60?text=?'}
                alt={item.title}
                sx={{ width: 60, height: 60, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
              />
              <Box flex={1}>
                <Typography fontWeight="bold" fontSize={15}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">כמות: {item.quantity} × ₪{item.price}</Typography>
              </Box>
              <Typography fontWeight="bold" sx={{ color: 'primary.main' }} fontSize={16}>
                ₪{item.price * item.quantity}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Shipping section */}


        <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 2, mb: 3 }}>
          <Typography fontWeight="bold" mb={1.5}>פרטי משלוח</Typography>
{/* <form onSubmit={handleAddressSubmit}> */}
  <Grid
    container
    direction="column"
    justifyContent="center"
    alignItems="center"
    spacing={3}
  >
    <Grid>
      <TextField
        label={t('address')}
        name="address"
        value={address.address}
        onChange={handleAddressChange}
        variant="outlined"
        sx={{ width: '250px' }}
      />
    </Grid>

    <Grid>
      <TextField
        label={t('city')}
        name="city"
        value={address.city}
        onChange={handleAddressChange}
        variant="outlined"
        sx={{ width: '250px' }}
      />
    </Grid>

    <Grid>
      <TextField
        label={t('postalCode')}
        name="postalCode"
        value={address.postalCode}
        onChange={handleAddressChange}
        variant="outlined"
        sx={{ width: '250px' }}
      />
    </Grid>

    <Grid>
      <TextField
        label={t('phoneNumber')}
        name="phoneNumber"
        value={address.phoneNumber}
        onChange={handleAddressChange}
        variant="outlined"
        sx={{ width: '250px' }}
      />
    </Grid>
  </Grid>
  {/* </form> */}
          <ToggleButtonGroup
            value={shippingOption}
            exclusive
            onChange={(_, val) => { if (val) setShippingOption(val); }}
            fullWidth
            sx={{ gap: 1 }}
          >
            <ToggleButton
              value={SHIPPING_FREE}
              sx={{
                flex: 1, borderRadius: 2, textTransform: 'none', fontSize: 13, py: 1.2,
                '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } },
              }}
            >
              ✅ טבריה והסביבה — משלוח חינם
            </ToggleButton>
            <ToggleButton
              value={SHIPPING_PAID}
              sx={{
                flex: 1, borderRadius: 2, textTransform: 'none', fontSize: 13, py: 1.2,
                '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } },
              }}
            >
              📦 אחר — משלוח ₪{SHIPPING_COST}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Totals */}
        <Box sx={{ px: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography color="text.secondary">מוצרים</Typography>
            <Typography>₪{itemsTotal}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="text.secondary">משלוח</Typography>
            <Typography color={shippingCost === 0 ? 'success.main' : 'text.primary'}>
              {shippingCost === 0 ? 'חינם' : `₪${shippingCost}`}
            </Typography>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold">סה״כ לתשלום</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.main' }}>₪{grandTotal}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {validationError && (
          <Alert severity="error" onClose={() => setValidationError('')} sx={{ mb: 2 }}>
            {validationError}
          </Alert>
        )}
        {orderError && (
          <Alert severity="error" onClose={() => setOrderError('')} sx={{ mb: 2 }}>
            {orderError}
          </Alert>
        )}
        <Stack spacing={1.5}>
          <Button
            variant="contained"
            onClick={handleBit}
            fullWidth
            sx={{ backgroundColor: '#0080FF', py: 1.5, fontSize: 16, borderRadius: 2, '&:hover': { backgroundColor: '#0066CC' } }}
          >
            שלם בביט
          </Button>
          <Button
            variant="outlined"
            onClick={handlePayLater}
            fullWidth
            sx={{ py: 1.5, fontSize: 16, borderRadius: 2, color: 'text.secondary', borderColor: 'divider', '&:hover': { borderColor: 'text.disabled', bgcolor: 'background.paper' } }}
          >
            אשלם מאוחר יותר
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PaymentPage;
