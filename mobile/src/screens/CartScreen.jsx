import React from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { Card, Text, Button, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

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

  const handleOrder = () => {
    if (!currentUser) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('Payment');
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.row}>
        <Image
          source={{ uri: item.pic || 'https://placehold.co/60x60?text=?' }}
          style={styles.image}
        />
        <View style={{ flex: 1 }}>
          <Text variant="titleSmall" style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.price}>₪{item.price} × {item.quantity} = ₪{item.price * item.quantity}</Text>
        </View>
        <View style={styles.controls}>
          <IconButton icon="minus" size={18} iconColor="#1A1A1A" onPress={() => decrement(item)} />
          <Text style={styles.qty}>{item.quantity}</Text>
          <IconButton icon="plus" size={18} iconColor="#1A1A1A" onPress={() => increment(item)} />
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
        <Button mode="contained" onPress={handleOrder} buttonColor="#FF6B00" style={styles.orderBtn}>
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  list: { padding: 12 },
  card: { marginBottom: 10, backgroundColor: '#F8F9FA', elevation: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  image: { width: 60, height: 60, borderRadius: 8 },
  itemTitle: { color: '#1A1A1A', fontWeight: 'bold' },
  price: { color: '#FF6B00', marginTop: 4 },
  controls: { flexDirection: 'row', alignItems: 'center' },
  qty: { color: '#1A1A1A', fontSize: 16, minWidth: 24, textAlign: 'center' },
  footer: { padding: 16, backgroundColor: '#F8F9FA', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  total: { color: '#1A1A1A', marginBottom: 12, textAlign: 'center' },
  orderBtn: { marginBottom: 8 },
  clearBtn: {},
  empty: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#6B7280', fontSize: 18 },
});

export default CartScreen;
