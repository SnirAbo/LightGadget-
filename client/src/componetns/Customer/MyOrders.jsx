import { Box, Typography, Paper, Chip } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../api';
import { useLanguage } from '../../LanguageContext';

const STATUS_HE = { pending: 'ממתין', shipped: 'נשלח', delivered: 'הושלם' };

const MyOrdersComp = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my').then((res) => setOrders(res.data)).catch(() => {});
  }, []);

  return (
    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f0f0', borderRadius: 2, maxWidth: 700, margin: 'auto', padding: 3 }}>
      <Typography sx={{ mt: 1, mb: 2, margin: 'auto' }} variant="h4" fontWeight="bold">
        {t('ordersTitle')}
      </Typography>
      <TableContainer sx={{ maxWidth: 700 }} component={Paper}>
        <Table size="small" aria-label="my orders">
          <TableHead>
            <TableRow>
              <TableCell>{t('dateCol')}</TableCell>
              <TableCell>{t('titleCol')}</TableCell>
              <TableCell align="right">עיר</TableCell>
              <TableCell align="right">משלוח</TableCell>
              <TableCell align="right">{t('totalCol')}</TableCell>
              <TableCell align="right">סטטוס</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{new Date(order.createdAt).toLocaleDateString('he-IL')}</TableCell>
                <TableCell>
                  {order.items?.map((item, i) => (
                    <Typography key={i} variant="body2">{item.title} × {item.quantity}</Typography>
                  ))}
                </TableCell>
                <TableCell align="right">{order.city || '—'}</TableCell>
                <TableCell align="right">{order.shippingCost === 0 ? 'חינם' : `₪${order.shippingCost}`}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>₪{order.totalPrice}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={STATUS_HE[order.status] ?? order.status}
                    size="small"
                    color={order.status === 'delivered' ? 'success' : order.status === 'shipped' ? 'info' : 'default'}
                  />
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                  אין הזמנות עדיין
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyOrdersComp;
