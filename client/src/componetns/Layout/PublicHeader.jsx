import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLanguage } from '../../LanguageContext';
import { useCartDrawer } from '../../CartDrawerContext';

const PublicHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t, toggleLang } = useLanguage();
  const currentUser = useSelector((state) => state.user.currentUser);
  const cartCount = useSelector((state) =>
    state.cart.cart.reduce((sum, item) => sum + item.quantity, 0)
  );

  const { setCartOpen } = useCartDrawer();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT_USER' });
    sessionStorage.clear();
    localStorage.removeItem('token');
    navigate('/');
  };

  const navSx = (path) => ({
    color: location.pathname === path ? 'primary.main' : 'text.primary',
    position: 'relative',
    ...(location.pathname === path && {
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -6,
        insetInline: 0,
        height: '3px',
        transform: 'skewX(-15deg)',
        borderRadius: '2px',
        background: 'linear-gradient(90deg, #FFD60A 0%, #FF6B00 100%)',
      },
    }),
  });

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 700, me: 4 }}
        >
          LightGadget
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton onClick={() => setCartOpen((v) => !v)} sx={{ me: 1, color: 'text.primary' }}>
          <Badge badgeContent={cartCount} color="primary">
            <ShoppingCartOutlinedIcon />
          </Badge>
        </IconButton>

        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ me: 1, color: 'text.secondary' }}>
              שלום {currentUser.firstName}
            </Typography>
            <Button component={Link} to="/account/myaccount" size="small" sx={navSx('/account/myaccount')}>
              {t('myAccount')}
            </Button>
            <Button component={Link} to="/account/orders" size="small" sx={navSx('/account/orders')}>
              {t('orders')}
            </Button>
            {currentUser.role === 'admin' && (
              <Button
                component={Link}
                to="/admin"
                size="small"
                variant="outlined"
                sx={{ ...navSx('/admin'), borderColor: 'primary.main', color: 'primary.main' }}
              >
                {t('adminPanel')}
              </Button>
            )}
            <Button onClick={handleLogout} size="small" sx={{ color: 'text.primary' }}>
              {t('logOut')}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={Link} to="/login" variant="outlined" size="small" sx={navSx('/login')}>
              {t('login')}
            </Button>
            <Button component={Link} to="/register" variant="contained" size="small">
              {t('register')}
            </Button>
          </Box>
        )}

        <Button onClick={toggleLang} size="small" sx={{ ms: 1, color: 'text.secondary' }}>
          {t('langToggle')}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default PublicHeader;
