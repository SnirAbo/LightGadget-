import { Box, Typography, Divider, Button, Stack, Drawer, IconButton } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';
import { useCartDrawer } from '../../CartDrawerContext';

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.user.currentUser);
  const { cartOpen, setCartOpen } = useCartDrawer();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const handleCartQty = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: { _id: item._id } });
    } else if (newQty <= (item.stock ?? Infinity)) {
      dispatch({ type: 'SET_QUANTITY', payload: { id: item._id, quantity: newQty } });
    }
  };

  const handleOrder = () => {
    if (cart.length === 0) return;
    if (!user) {
      setCartOpen(false);
      navigate('/login');
      return;
    }
    setCartOpen(false);
    navigate('/payment');
  };

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 380 },
          p: 2,
          bgcolor: 'background.default',
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {cart.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 8 }}>
            <ShoppingCartOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
            <Typography variant="h3" color="text.secondary">{t('cartEmpty')}</Typography>
            <Typography variant="body2" color="text.disabled">{t('cartEmptySub')}</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {cart.map((product) => (
                <Card key={product._id} sx={{ mb: 1 }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        component="img"
                        src={product.pic || 'https://placehold.co/60x60?text=?'}
                        alt={product.title}
                        sx={{ width: 60, height: 60, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
                      />
                      <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{product.title}</Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <IconButton size="small" onClick={() => handleCartQty(product, -1)} aria-label={t('decreaseQty')}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{product.quantity}</Typography>
                          <IconButton size="small" onClick={() => handleCartQty(product, 1)} disabled={product.quantity >= (product.stock ?? Infinity)} aria-label={t('increaseQty')}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: 'primary.main' }}>₪{product.quantity * product.price}</Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                  <Divider />
                </Card>
              ))}
            </Box>

            <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1">{t('total')} ₪{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</Typography>
              <Typography variant="subtitle2">{t('items')} {cart.reduce((sum, item) => sum + item.quantity, 0)}</Typography>
              <Stack>
                <Button onClick={handleOrder} variant="contained" color="primary" sx={{ mt: 1 }}>
                  {t('order')}
                </Button>
                <Button onClick={() => clearCart()} variant="outlined" sx={{ mt: 1 }}>
                  {t('clearCart')}
                </Button>
              </Stack>
            </Box>
          </>
        )}

      </Box>
    </Drawer>
  );
};

export default Cart;
