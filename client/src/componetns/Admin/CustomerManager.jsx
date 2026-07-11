import { Box, Typography, Paper } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../../api';
import { useLanguage } from '../../LanguageContext';

const CustomerManagerComp = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/users').then((res) => setUsers(res.data)).catch(() => {});
    api.get('/orders').then((res) => setOrders(res.data)).catch(() => {});
  }, []);

  const ordersForUser = (userId) =>
    orders.filter((o) => (o.user?._id ?? o.user) === userId);

  return (
    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f0f0', borderRadius: 2, maxWidth: 800, margin: 'auto', padding: 3 }}>
      <Typography sx={{ mt: 1, mb: 2 }} variant="h4" fontWeight="bold">
        {t('customersTitle')}
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('fullName')}</TableCell>
              <TableCell align="right">הזמנות</TableCell>
              <TableCell align="right">סה״כ הוצאה</TableCell>
              <TableCell>{t('productsBought')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const userOrders = ordersForUser(user._id);
              const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalPrice ?? 0), 0);
              const allItems = userOrders.flatMap((o) => o.items ?? []);

              const itemTotals = allItems.reduce((acc, item) => {
                acc[item.title] = (acc[item.title] ?? 0) + item.quantity;
                return acc;
              }, {});

              return (
                <TableRow key={user._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, verticalAlign: 'top' }}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell align="right">{userOrders.length}</TableCell>
                  <TableCell align="right">₪{totalSpent}</TableCell>
                  <TableCell>
                    {Object.entries(itemTotals).length === 0 ? (
                      <Typography variant="body2" color="text.secondary">—</Typography>
                    ) : (
                      Object.entries(itemTotals).map(([title, qty]) => (
                        <Typography key={title} variant="body2">{title} × {qty}</Typography>
                      ))
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                  אין לקוחות
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomerManagerComp;
