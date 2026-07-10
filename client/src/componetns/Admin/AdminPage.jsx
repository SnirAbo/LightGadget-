import { Box, Typography, Stack, Button } from '@mui/material';
import { Link , Outlet } from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';

const AdminPageComp = () => {
    const { t, toggleLang } = useLanguage();
return (
    <>
    <Box>
      {/* כותרת */}
      <Typography variant="h5" align="center" sx={{ my: 2 }}>
        {t('helloAdmin')}
      </Typography>

      {/* תפריט ניווט */}
      <Stack direction="row" spacing={4} justifyContent="center" sx={{ mb: 2 }}>
        <Button component={Link} to="/">🏠 דף הבית</Button>
        <Button component={Link} to="/account">{t('account')}</Button>
        <Button component={Link} to="category">{t('categories')}</Button>
        <Button component={Link} to="product">{t('products')}</Button>
        <Button component={Link} to="customer">{t('customers')}</Button>
        <Button component={Link} to="statistics">{t('statistics')}</Button>
        <Button component={Link} to="orders">הזמנות</Button>
        <Button onClick={toggleLang} variant="outlined" size="small">{t('langToggle')}</Button>
      </Stack>


    <Box sx={{ borderTop: '2px solid #ccc' }}>
         <Box sx={{ mt: 4 }}>
            <Outlet />
         </Box>
    </Box>
    </Box>
    </>
 );
}

export default AdminPageComp;
