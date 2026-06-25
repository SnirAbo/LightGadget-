import { Box, Typography, Paper } from '@mui/material';
import {Table , TableBody , TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';

import api from '../../api';
import { useDispatch } from 'react-redux';
import {useEffect} from 'react';
import { useLanguage } from '../../LanguageContext';

const MyOrdersComp = () => {
    const dispatch = useDispatch();
    const { t } = useLanguage();
    const products = useSelector((state) => state.product.products) ;
    const currentUser = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        api.get('/products').then((res) => {
          dispatch({ type: 'LOAD_PRODUCT', payload: res.data });
        });
      }, []);

return (
    <>
    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f0f0', borderRadius: 2 , maxWidth: 450, margin: 'auto', padding: 3, }}>
    <Typography sx={{ mt:1, margin: 'auto' }} variant="h4" fontWeight="bold">{t('ordersTitle')}</Typography>
<TableContainer  sx={{ maxWidth:450 }} component={Paper}>
      <Table  size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>{t('titleCol')}</TableCell>
            <TableCell align="right">{t('qtyCol')}</TableCell>
            <TableCell align="right">{t('totalCol')}</TableCell>
            <TableCell align="right">{t('dateCol')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {products.map((product) => {
                const myPurchases = product.boughtBy.filter(user => user.name === `${currentUser.firstName} ${currentUser.lastName}`.toLowerCase());
                return myPurchases.map(order => (

                    <TableRow key={product.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >

                    <TableCell align="right"> {product.title}</TableCell>
                    <TableCell align="right">{order.quantity}</TableCell>
                    <TableCell align="right">{order.quantity * product.price}</TableCell>
                    <TableCell align="right">{new Date(order.date.seconds * 1000).toLocaleDateString()}</TableCell>
                  </TableRow>
                ));

            })}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    </>
 );
}

export default MyOrdersComp;
