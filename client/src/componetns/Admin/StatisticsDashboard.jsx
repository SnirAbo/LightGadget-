import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useState, useEffect } from 'react';
import api from '../../api';
import { Box, Typography, Select, MenuItem, Divider } from '@mui/material';
import { useLanguage } from '../../LanguageContext';

const StatisticsDashboardComp = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    api.get('/users').then((res) => setUsers(res.data)).catch(() => {});
    api.get('/orders').then((res) => setOrders(res.data)).catch(() => {});
  }, []);

  // PieChart: total qty sold per product title across all orders
  const productTotals = orders
    .flatMap((o) => o.items ?? [])
    .reduce((acc, item) => {
      acc[item.title] = (acc[item.title] ?? 0) + item.quantity;
      return acc;
    }, {});

  const pieData = Object.entries(productTotals)
    .filter(([, qty]) => qty > 0)
    .map(([title, qty], i) => ({ id: i, label: title, value: qty }));

  // BarChart: items bought by the selected user
  const userOrders = selectedUserId
    ? orders.filter((o) => (o.user?._id ?? o.user) === selectedUserId)
    : [];

  const userItemTotals = userOrders
    .flatMap((o) => o.items ?? [])
    .reduce((acc, item) => {
      acc[item.title] = (acc[item.title] ?? 0) + item.quantity;
      return acc;
    }, {});

  const barEntries = Object.entries(userItemTotals).sort((a, b) => a[1] - b[1]);
  const barLabels = barEntries.map(([title]) => title);
  const barValues = barEntries.map(([, qty]) => qty);

  return (
    <>
      <Box sx={{ padding: 2, margin: 'auto', backgroundColor: 'lightgrey', maxWidth: 500 }}>
        <Typography sx={{ textAlign: 'center', margin: 'auto' }}>{t('totalSoldProducts')}</Typography>
        <Box sx={{ border: '1px solid white', maxWidth: 400, margin: 'auto' }}>
          {pieData.length > 0 ? (
            <PieChart
              series={[{ data: pieData }]}
              width={400}
              height={200}
            />
          ) : (
            <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>אין נתונים</Typography>
          )}
        </Box>
      </Box>

      <Divider />

      <Box sx={{ padding: 2, margin: 'auto', backgroundColor: 'lightgrey', maxWidth: 500 }}>
        <Select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          displayEmpty
          sx={{ height: 25, mb: 2 }}
        >
          <MenuItem value="">{t('selectUser')}</MenuItem>
          {users.map((user) => (
            <MenuItem key={user._id} value={user._id}>
              {user.firstName} {user.lastName}
            </MenuItem>
          ))}
        </Select>

        {selectedUserId && (
          <BarChart
            series={[{
              type: 'bar',
              data: barValues,
              label: t('qtyLabel'),
            }]}
            xAxis={[{ data: barLabels, scaleType: 'band' }]}
            width={500}
            height={300}
          />
        )}
      </Box>
    </>
  );
};

export default StatisticsDashboardComp;
