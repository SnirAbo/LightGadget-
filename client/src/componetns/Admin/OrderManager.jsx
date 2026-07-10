import { Box, Typography, Paper, Select, MenuItem, Snackbar, Alert, Chip } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../api';
import { useLanguage } from '../../LanguageContext';

const STATUS_HE = { pending: 'ממתין', shipped: 'נשלח', delivered: 'הושלם' };
const STATUS_COLOR = { pending: 'default', shipped: 'info', delivered: 'success' };

const OrderManagerComp = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const showSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const fetchOrders = () => {
    api.get('/orders').then((res) => setOrders(res.data)).catch(() => showSnack('שגיאה בטעינת הזמנות', 'error'));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}`, { status: newStatus });
      fetchOrders();
      showSnack('סטטוס עודכן בהצלחה');
    } catch {
      showSnack('שגיאה בעדכון סטטוס', 'error');
    }
  };

  return (
    <>
      <Box sx={{ pt: 2, mt: 1, maxWidth: 1100, margin: 'auto', padding: 3, backgroundColor: '#b2b2b2', borderRadius: 2 }}>
        <Typography sx={{ mt: 1, mb: 2 }} variant="h4" fontWeight="bold">
          הזמנות
        </Typography>

        <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f0f0', borderRadius: 2, overflowX: 'auto' }}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>תאריך</TableCell>
                  <TableCell>לקוח</TableCell>
                  <TableCell>פריטים</TableCell>
                  <TableCell>כתובת</TableCell>
                  <TableCell>עיר</TableCell>
                  <TableCell>מיקוד</TableCell>
                  <TableCell>טלפון</TableCell>
                  <TableCell align="right">משלוח</TableCell>
                  <TableCell align="right">סה״כ</TableCell>
                  <TableCell align="center">סטטוס</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {new Date(order.createdAt).toLocaleDateString('he-IL')}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {order.user
                        ? `${order.user.firstName} ${order.user.lastName}`
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {order.items?.map((item, i) => (
                        <Typography key={i} variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                          {item.title} × {item.quantity}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell>{order.address}</TableCell>
                    <TableCell>{order.city}</TableCell>
                    <TableCell>{order.postalCode}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{order.phoneNumber}</TableCell>
                    <TableCell align="right">
                      {order.shippingCost === 0 ? 'חינם' : `₪${order.shippingCost}`}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      ₪{order.totalPrice}
                    </TableCell>
                    <TableCell align="center">
                      <Select
                        value={order.status}
                        size="small"
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        renderValue={(val) => (
                          <Chip
                            label={STATUS_HE[val] ?? val}
                            size="small"
                            color={STATUS_COLOR[val] ?? 'default'}
                          />
                        )}
                        sx={{ minWidth: 110 }}
                      >
                        <MenuItem value="pending">ממתין</MenuItem>
                        <MenuItem value="shipped">נשלח</MenuItem>
                        <MenuItem value="delivered">הושלם</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                      אין הזמנות
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={closeSnack} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={closeSnack} severity={snack.severity} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OrderManagerComp;
