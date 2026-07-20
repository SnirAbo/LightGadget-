import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Badge,
  IconButton, Menu, MenuItem, Divider,
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLanguage } from '../../LanguageContext';
import { useCartDrawer } from '../../CartDrawerContext';
import LogoImage from '../../assets/logo.png';

const PublicHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t, toggleLang, lang } = useLanguage();
  const currentUser = useSelector((state) => state.user.currentUser);
  const cartCount = useSelector((state) =>
    state.cart.cart.reduce((sum, item) => sum + item.quantity, 0)
  );
  const { setCartOpen } = useCartDrawer();
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

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

  // anchorOrigin/transformOrigin are physical props — not flipped by stylis-plugin-rtl.
  // In RTL the hamburger lands on the left edge, so the menu must open leftward.
  const menuEdge = lang === 'he' ? 'left' : 'right';

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 80 } }}>
        {/* <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 700, me: 4 }}
        >
          LightGadget
        </Typography> */}
        <Box 
        component={Link}
        to="/"
        sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component="img" src={LogoImage} alt="LightGadget"
        sx={{ 
          height: 64,
          width: 'auto',
          display: 'block',
          borderRadius: '8px',
        }} />
        </Box>
        <Box sx={{ flexGrow: 1}} />

        {/* Desktop nav — hidden on mobile */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
          {currentUser ? (
            <>
              <Typography variant="body2" sx={{ me: 1, color: 'text.secondary' }}>
                {t('hello')} {currentUser.firstName}
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
            </>
          ) : (
            <>
              <Button component={Link} to="/login" variant="outlined" size="small" sx={navSx('/login')}>
                {t('login')}
              </Button>
              <Button component={Link} to="/register" variant="contained" size="small">
                {t('register')}
              </Button>
            </>
          )}
        </Box>

        {/* Cart — always visible */}
        <IconButton
          onClick={() => setCartOpen((v) => !v)}
          sx={{ ms: 1, color: 'text.primary' }}
          aria-label={t('items')}
        >
          <Badge badgeContent={cartCount} color="primary">
            <ShoppingCartOutlinedIcon />
          </Badge>
        </IconButton>

        {/* Language toggle — always visible */}
        <Button onClick={toggleLang} size="small" sx={{ ms: 1, color: 'text.secondary' }}>
          {t('langToggle')}
        </Button>

        {/* Hamburger — mobile only (xs); hidden at sm+ */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{ display: { xs: 'flex', sm: 'none' }, ms: 1, color: 'text.primary' }}
          aria-label={t('navigationMenu')}
          aria-controls={menuAnchor ? 'nav-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={menuAnchor ? 'true' : undefined}
        >
          <MenuIcon />
        </IconButton>

        {/* Hamburger dropdown — menuEdge keeps it inward in both LTR and RTL */}
        <Menu
          id="nav-menu"
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: menuEdge }}
          transformOrigin={{ vertical: 'top', horizontal: menuEdge }}
        >
          {currentUser ? [
            <MenuItem key="greeting" disabled>
              <Typography variant="body2">{t('hello')} {currentUser.firstName}</Typography>
            </MenuItem>,
            <Divider key="d1" />,
            <MenuItem key="account" component={Link} to="/account/myaccount" onClick={handleMenuClose}>
              {t('myAccount')}
            </MenuItem>,
            <MenuItem key="orders" component={Link} to="/account/orders" onClick={handleMenuClose}>
              {t('orders')}
            </MenuItem>,
            ...(currentUser.role === 'admin' ? [
              <MenuItem key="admin" component={Link} to="/admin" onClick={handleMenuClose}>
                {t('adminPanel')}
              </MenuItem>,
            ] : []),
            <Divider key="d2" />,
            <MenuItem key="logout" onClick={() => { handleLogout(); handleMenuClose(); }}>
              {t('logOut')}
            </MenuItem>,
          ] : [
            <MenuItem key="login" component={Link} to="/login" onClick={handleMenuClose}>
              {t('login')}
            </MenuItem>,
            <MenuItem key="register" component={Link} to="/register" onClick={handleMenuClose}>
              {t('register')}
            </MenuItem>,
          ]}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default PublicHeader;
