import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';

const OrdersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (currentUser) {
      api.get('/products').then((res) => dispatch({ type: 'LOAD_PRODUCT', payload: res.data }));
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>יש להתחבר כדי לראות הזמנות</Text>
        <Button mode="contained" onPress={() => navigation.navigate('Login')} buttonColor="#3B82F6" style={styles.loginBtn}>
          התחבר
        </Button>
      </View>
    );
  }

  const myOrders = [];
  const fullName = `${currentUser.firstName} ${currentUser.lastName}`.toLowerCase();
  products.forEach((product) => {
    product.boughtBy?.forEach((order) => {
      if (order.name === fullName) {
        myOrders.push({
          key: `${product._id}-${order.date?.seconds ?? Math.random()}`,
          title: product.title,
          quantity: order.quantity,
          total: order.quantity * product.price,
          date: order.date?.seconds ? new Date(order.date.seconds * 1000).toLocaleDateString() : '',
        });
      }
    });
  });

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.heading}>הזמנות שלי</Text>
      {myOrders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>אין הזמנות עדיין</Text>
        </View>
      ) : (
        <FlatList
          data={myOrders}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleSmall" style={styles.title}>{item.title}</Text>
                <Text style={styles.detail}>כמות: {item.quantity}</Text>
                <Text style={styles.detail}>סה"כ: ₪{item.total}</Text>
                <Text style={styles.detail}>תאריך: {item.date}</Text>
              </Card.Content>
            </Card>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 12 },
  heading: { color: '#F8FAFC', fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  list: { paddingBottom: 16 },
  card: { marginBottom: 10, backgroundColor: '#1E293B' },
  title: { color: '#F8FAFC', fontWeight: 'bold' },
  detail: { color: '#94A3B8', marginTop: 2 },
  empty: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#94A3B8', fontSize: 18, marginBottom: 16 },
  loginBtn: { marginTop: 8 },
});

export default OrdersScreen;
