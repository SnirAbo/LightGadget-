import { Box, Typography, Paper, Chip, Button, Alert } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useLanguage } from '../../LanguageContext';
import SectionTitle from '../SectionTitle';

const STATUS_HE = { pending: 'ממתין', shipped: 'נשלח', delivered: 'הושלם' };
const STATUS_CHIP_SX = {
  pending:   { bgcolor: 'warning.light', color: 'warning.main', fontWeight: 500 },
  shipped:   { bgcolor: 'info.light',    color: 'info.main',    fontWeight: 500 },
  delivered: { bgcolor: 'success.light', color: 'success.main', fontWeight: 500 },
};

const MyOrdersComp = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    setError(false);
    api.get('/orders/my').then((res) => {
      setOrders(res.data);
      setLoading(false);
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchOrders(); }, []);

  if (!loading && error) {
    return (
      <Box sx={{ p: 2, maxWidth: 700, margin: 'auto', mt: 2 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchOrders}>
              {t('retry')}
            </Button>
          }
        >
          {t('errorLoadingOrders')}
        </Alert>
      </Box>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 8 }}>
        <ShoppingBagOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
        <Typography variant="h3">אין הזמנות עדיין</Typography>
        <Typography variant="body2" color="text.secondary">ההזמנות שלך יופיעו כאן</Typography>
        <Button variant="contained" component={Link} to="/">לקטלוג</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2, p: 2, maxWidth: 700, margin: 'auto' }}>
      <SectionTitle>{t('ordersTitle')}</SectionTitle>
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
                    sx={STATUS_CHIP_SX[order.status] ?? { fontWeight: 500 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyOrdersComp;
