import { Box, Typography, Button, Divider, Stack, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api';

const SHIPPING_FREE = 'free';
const SHIPPING_PAID = 'paid';
const SHIPPING_COST = 60;

const PaymentPage = () => {
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [city, setCity] = useState('');
  const [shippingOption, setShippingOption] = useState(SHIPPING_FREE);

  const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingOption === SHIPPING_PAID ? SHIPPING_COST : 0;
  const grandTotal = itemsTotal + shippingCost;

  useEffect(() => {
    if (!user) navigate('/login');
    else if (cart.length === 0) navigate('/');
  }, []);

  if (!user || cart.length === 0) return null;

  const completeOrder = async () => {
    for (const product of cart) {
      await api.put(`/products/${product._id}/push-bought`, {
        name: `${user.firstName} ${user.lastName}`,
        date: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        quantity: product.quantity,
      });
    }
    dispatch({ type: 'CLEAR_CART' });
  };

  const buildWaText = () => {
    const itemLines = cart.map(p => `${p.title} × ${p.quantity} = ₪${p.price * p.quantity}`).join('\n');
    const shippingLine = shippingCost > 0 ? `\nמשלוח: ₪${shippingCost}` : '\nמשלוח: חינם';
    const cityLine = city ? `\nעיר: ${city}` : '';
    return `🛒 הזמנה חדשה!\nשם: ${user.firstName} ${user.lastName}${cityLine}\nפריטים:\n${itemLines}${shippingLine}\nסה״כ: ₪${grandTotal}\nאנא אשר את ההזמנה 🙏`;
  };

  const handleBit = async () => {
    await completeOrder();
    window.open(`https://pay.bit.co.il/pay?phoneNumber=0538280217&amount=${grandTotal}`, '_blank');
    window.open(`https://wa.me/972538280217?text=${encodeURIComponent(buildWaText())}`, '_blank');
    navigate('/account/orders');
  };

  const handlePayLater = async () => {
    await completeOrder();
    window.open(`https://wa.me/972538280217?text=${encodeURIComponent(buildWaText())}`, '_blank');
    navigate('/account/orders');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', pt: 6, px: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
          סיכום הזמנה
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
          בחר אמצעי תשלום להשלמת ההזמנה
        </Typography>

        {/* Order items */}
        <Box sx={{ backgroundColor: '#F8F9FA', borderRadius: 3, p: 2, mb: 3 }}>
          {cart.map((item) => (
            <Box key={item._id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, borderBottom: '1px solid #E5E7EB', '&:last-child': { borderBottom: 'none' } }}>
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
              <Typography fontWeight="bold" color="#FF6B00" fontSize={16}>
                ₪{item.price * item.quantity}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Shipping section */}
        <Box sx={{ backgroundColor: '#F8F9FA', borderRadius: 3, p: 2, mb: 3 }}>
          <Typography fontWeight="bold" mb={1.5}>פרטי משלוח</Typography>
          <TextField
            label="עיר למשלוח"
            placeholder="הזן עיר למשלוח"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          />
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
                '&.Mui-selected': { backgroundColor: '#FF6B00', color: '#fff', '&:hover': { backgroundColor: '#e05a00' } },
              }}
            >
              ✅ טבריה והסביבה — משלוח חינם
            </ToggleButton>
            <ToggleButton
              value={SHIPPING_PAID}
              sx={{
                flex: 1, borderRadius: 2, textTransform: 'none', fontSize: 13, py: 1.2,
                '&.Mui-selected': { backgroundColor: '#FF6B00', color: '#fff', '&:hover': { backgroundColor: '#e05a00' } },
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
            <Typography variant="h6" fontWeight="bold" color="#FF6B00">₪{grandTotal}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

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
            sx={{ py: 1.5, fontSize: 16, borderRadius: 2, color: '#6B7280', borderColor: '#E5E7EB', '&:hover': { borderColor: '#9CA3AF', backgroundColor: '#F9FAFB' } }}
          >
            אשלם מאוחר יותר
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PaymentPage;
