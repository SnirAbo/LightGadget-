import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLanguage } from '../../LanguageContext';

const PublicHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, toggleLang } = useLanguage();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT_USER' });
    sessionStorage.clear();
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', mr: 4 }}
        >
          GadgetLight
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
             שלום {currentUser.firstName} 
            </Typography>
            <Button component={Link} to="/account/myaccount" size="small">
              {t('myAccount')}
            </Button>
            <Button component={Link} to="/account/orders" size="small">
              {t('orders')}
            </Button>
            {currentUser.role === 'admin' && (
              <Button component={Link} to="/admin" size="small" color="warning" variant="outlined">
                {t('adminPanel')}
              </Button>
            )}
            <Button onClick={handleLogout} size="small">
              {t('logOut')}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={Link} to="/login" variant="outlined" size="small">
              {t('login')}
            </Button>
            <Button component={Link} to="/register" variant="contained" size="small">
              {t('register')}
            </Button>
          </Box>
        )}

        <Button onClick={toggleLang} size="small" sx={{ ml: 1 }}>
          {t('langToggle')}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default PublicHeader;
