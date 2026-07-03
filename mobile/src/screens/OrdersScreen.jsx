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
      api.get('/products').then((res) => {
        dispatch({ type: 'LOAD_PRODUCT', payload: res.data });
      });
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

  const myOrders = [];
  const fullName = `${currentUser.firstName} ${currentUser.lastName}`.toLowerCase();
  products.forEach((product) => {
    product.boughtBy?.forEach((order) => {
      if (order.name?.toLowerCase() === fullName) {
        let dateStr = '';
        if (order.date?.seconds) {
          dateStr = new Date(order.date.seconds * 1000).toLocaleDateString();
        } else if (order.date) {
          dateStr = new Date(order.date).toLocaleDateString();
        }
        myOrders.push({
          key: `${product._id}-${order.date?.seconds ?? Math.random()}`,
          title: product.title,
          quantity: order.quantity,
          price: product.price,
          total: order.quantity * product.price,
          date: dateStr,
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
                <Text style={styles.detail}>כמות: {item.quantity} × ₪{item.price}</Text>
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
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 12 },
  heading: { color: '#1A1A1A', fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  list: { paddingBottom: 16 },
  card: { marginBottom: 10, backgroundColor: '#F8F9FA', elevation: 1 },
  title: { color: '#1A1A1A', fontWeight: 'bold' },
  detail: { color: '#6B7280', marginTop: 2 },
  empty: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#6B7280', fontSize: 18, marginBottom: 16 },
  loginBtn: { marginTop: 8 },
});

export default OrdersScreen;
