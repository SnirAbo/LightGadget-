import React from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Text, Button, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import api from '../api/api';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const currentUser = useSelector((state) => state.user.currentUser);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeItem = (item) => dispatch({ type: 'REMOVE_FROM_CART', payload: item });

  const increment = (item) => dispatch({ type: 'ADD_TO_CART', payload: item });

  const decrement = (item) => {
    if (item.quantity === 1) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: item });
    } else {
      dispatch({ type: 'DECREMENT_QUANTITY', payload: item._id });
    }
  };

  const handleOrder = async () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    if (cart.length === 0) {
      Alert.alert('עגלה ריקה', 'הוסף מוצרים לפני הזמנה');
      return;
    }
    try {
      const orderData = {
        userId: currentUser._id,
        products: cart.map((item) => ({ productId: item._id, quantity: item.quantity })),
        total,
        date: new Date(),
      };
      await api.post('/orders', orderData);
      dispatch({ type: 'CLEAR_CART' });
      Alert.alert('הצלחה', 'ההזמנה בוצעה!');
    } catch {
      Alert.alert('שגיאה', 'שגיאה בביצוע הזמנה');
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text variant="titleSmall" style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.price}>₪{item.price} × {item.quantity} = ₪{item.price * item.quantity}</Text>
        </View>
        <View style={styles.controls}>
          <IconButton icon="minus" size={18} iconColor="#F8FAFC" onPress={() => decrement(item)} />
          <Text style={styles.qty}>{item.quantity}</Text>
          <IconButton icon="plus" size={18} iconColor="#F8FAFC" onPress={() => increment(item)} />
          <IconButton icon="delete" size={18} iconColor="#EF4444" onPress={() => removeItem(item)} />
        </View>
      </Card.Content>
    </Card>
  );

  if (cart.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>העגלה ריקה</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <Text variant="titleMedium" style={styles.total}>סה"כ: ₪{total}</Text>
        <Button mode="contained" onPress={handleOrder} buttonColor="#22C55E" style={styles.orderBtn}>
          הזמן
        </Button>
        <Button
          mode="outlined"
          onPress={() => dispatch({ type: 'CLEAR_CART' })}
          textColor="#EF4444"
          style={styles.clearBtn}
        >
          נקה עגלה
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  list: { padding: 12 },
  card: { marginBottom: 10, backgroundColor: '#1E293B' },
  row: { flexDirection: 'row', alignItems: 'center' },
  itemTitle: { color: '#F8FAFC', fontWeight: 'bold' },
  price: { color: '#F59E0B', marginTop: 4 },
  controls: { flexDirection: 'row', alignItems: 'center' },
  qty: { color: '#F8FAFC', fontSize: 16, minWidth: 24, textAlign: 'center' },
  footer: { padding: 16, backgroundColor: '#1E293B', borderTopWidth: 1, borderTopColor: '#334155' },
  total: { color: '#F8FAFC', marginBottom: 12, textAlign: 'center' },
  orderBtn: { marginBottom: 8 },
  clearBtn: {},
  empty: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#94A3B8', fontSize: 18 },
});

export default CartScreen;
