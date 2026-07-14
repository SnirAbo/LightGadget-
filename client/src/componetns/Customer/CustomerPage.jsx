import { Box, Typography, Stack, Button } from '@mui/material';
import { Link , Outlet , useNavigate} from 'react-router-dom';
import { useDispatch , useSelector  } from 'react-redux';
import { useLanguage } from '../../LanguageContext';


const CustomerPageComp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, toggleLang } = useLanguage();
    const loggedUser = JSON.parse(sessionStorage.getItem('user'));


    const logOut = () => {
        dispatch({ type: 'LOGOUT_USER'});
        sessionStorage.clear();
        navigate('/');
        alert(t('loggedOut'));
    }

return (
    <>
    <Box>
      {/* כותרת */}
      <Typography variant="h5" align="center" sx={{ my: 2 }}>
        {t('hello')} {loggedUser.userName}
      </Typography>
      {/* תפריט ניווט */}
      <Stack direction="row" spacing={4} justifyContent="center" sx={{ mb: 2 }}>
        <Button component={Link} to="/">🏠 דף הבית</Button>
        <Button sx={{}} component={Link} to="myaccount">{t('myAccount')}</Button>
        <Button component={Link} to="orders">{t('orders')}</Button>
        <Button component={Link} to="products">{t('products')}</Button>
        {loggedUser.role === 'admin' && (
          <Button component={Link} to="/admin" variant="outlined" sx={{ color: 'primary.main', borderColor: 'primary.main' }}>{t('adminPanel')}</Button>
        )}
        <Button onClick={logOut}>{t('logOut')}</Button>
        <Button onClick={toggleLang} variant="outlined" size="small">{t('langToggle')}</Button>
      </Stack>


    <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        {/* פה ייכנס התוכן של הדפים הפנימיים */}
         <Box sx={{ mt: 4 }}>
            <Outlet />
         </Box>
    </Box>
    </Box>
    </>
 );
}

export default CustomerPageComp;
