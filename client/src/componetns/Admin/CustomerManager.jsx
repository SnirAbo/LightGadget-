import { Box, Typography, Paper, Button, TextField, Card, CardContent } from '@mui/material';
import {Table , TableBody , TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState ,useEffect } from 'react';
import api from '../../api';
import { useDispatch , useSelector } from 'react-redux';
import { useLanguage } from '../../LanguageContext';

const CustomerManagerComp = () => {
    const users = useSelector((state) => state.user.users);
    const products = useSelector((state) => state.product.products);
    const dispatch = useDispatch();
    const { t } = useLanguage();

    useEffect(() => {
        api.get('/users').then((res) => {
          dispatch({ type: 'LOAD_USERS', payload: res.data });
        });
      }, []);

      useEffect(() => {
        api.get('/products').then((res) => {
          dispatch({ type: 'LOAD_PRODUCT', payload: res.data });
        });
      }, []);

return (
    <>
    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f0f0', borderRadius: 2 , maxWidth: 450, margin: 'auto', padding: 3, }}>
    <Typography sx={{ mt:1, margin: 'auto' }} variant="h4" fontWeight="bold">{t('customersTitle')}</Typography>
<TableContainer  sx={{ maxWidth:450 }} component={Paper}>
      <Table  size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>{t('fullName')}</TableCell>
            <TableCell align="right">{t('joinedAt')}</TableCell>
            <TableCell align="right">{t('productsBought')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, ) => (
            <TableRow
              key={user.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell align="right">{t('check')}</TableCell>
              <TableCell align="right">{products.map((product) => {
                  const filteredEntries = product.boughtBy?.filter(
                    (entry) => `${entry.name}`.toLowerCase() === `${user.firstName} ${user.lastName}`.toLowerCase()
                  );

                  if (!filteredEntries || filteredEntries.length === 0) return null;
    return (

<TableContainer  sx={{ maxWidth:250 }} key={product.id} component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('product')}</TableCell>
            <TableCell align="right">{t('qtySmall')}</TableCell>
            <TableCell align="right">{t('dateSmall')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {product.boughtBy?.filter(entry => `${entry.name}`.toLowerCase() === `${user.firstName} ${user.lastName}`.toLowerCase())
        .map((entry, index) => (
        <TableRow key={index}>
      <TableCell>{product.title}</TableCell>
      <TableCell align="right">{entry.quantity}</TableCell>
      <TableCell align="right">{new Date(entry.date.seconds * 1000).toLocaleDateString()}</TableCell>
    </TableRow>
))}
        </TableBody>
      </Table>
    </TableContainer>

              );
              } )}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    </>
 );
}

export default CustomerManagerComp;
