import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { useSelector } from 'react-redux';
import api from '../api/api';

const STATUS_HE = { pending: 'ממתין', shipped: 'נשלח', delivered: 'הושלם' };

const OrdersScreen = ({ navigation }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (currentUser) {
      api.get('/orders/my').then((res) => setOrders(res.data)).catch(() => {});
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>יש להתחבר כדי לראות הזמנות</Text>
        <Button mode="contained" onPress={() => navigation.navigate('Login')} buttonColor="#FF6B00" style={styles.loginBtn}>
          התחבר
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.heading}>הזמנות שלי</Text>
      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>אין הזמנות עדיין</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text style={styles.date}>
                    {new Date(item.createdAt).toLocaleDateString('he-IL')}
                  </Text>
                  <Chip
                    compact
                    style={[styles.chip, item.status === 'delivered' && styles.chipGreen, item.status === 'shipped' && styles.chipBlue]}
                    textStyle={styles.chipText}
                  >
                    {STATUS_HE[item.status] ?? item.status}
                  </Chip>
                </View>
                {item.items?.map((line, i) => (
                  <Text key={i} style={styles.detail}>{line.title} × {line.quantity}</Text>
                ))}
                <View style={styles.footer}>
                  <Text style={styles.detail}>משלוח: {item.shippingCost === 0 ? 'חינם' : `₪${item.shippingCost}`}</Text>
                  <Text style={styles.total}>₪{item.totalPrice}</Text>
                </View>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 12 },
  heading: { color: '#1A1A1A', fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  list: { paddingBottom: 16 },
  card: { marginBottom: 10, backgroundColor: '#F8F9FA', elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  date: { color: '#6B7280', fontSize: 13 },
  detail: { color: '#6B7280', marginTop: 2, fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  total: { color: '#FF6B00', fontWeight: 'bold', fontSize: 15 },
  chip: { backgroundColor: '#E5E7EB' },
  chipGreen: { backgroundColor: '#D1FAE5' },
  chipBlue: { backgroundColor: '#DBEAFE' },
  chipText: { fontSize: 11 },
  empty: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#6B7280', fontSize: 18, marginBottom: 16 },
  loginBtn: { marginTop: 8 },
});

export default OrdersScreen;
