import React from 'react';
import { View, ScrollView, StyleSheet, Alert, Linking, Image } from 'react-native';
import { Text, Button, Divider, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';

const PaymentScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const currentUser = useSelector((state) => state.user.currentUser);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const completeOrder = async () => {
    await api.post('/orders', {
      user: currentUser._id,
      items: cart.map((item) => ({
        product: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      address: '',
      city: '',
      postalCode: '',
      phoneNumber: '',
      shippingCost: 0,
      totalPrice: total,
    });
    const itemLines = cart.map(i => `${i.title} × ${i.quantity} = ₪${i.price * i.quantity}`).join('\n');
    const waText = `🛒 הזמנה חדשה!\nשם: ${currentUser.firstName} ${currentUser.lastName}\nפריטים:\n${itemLines}\nסה״כ: ₪${total}\nאנא אשר את ההזמנה 🙏`;
    await Linking.openURL(`https://wa.me/972538280217?text=${encodeURIComponent(waText)}`);
    dispatch({ type: 'CLEAR_CART' });
  };

  const handleBit = async () => {
    try {
      await completeOrder();
      await Linking.openURL(`https://pay.bit.co.il/pay?phoneNumber=0538280217&amount=${total}`);
      navigation.navigate('Main', { screen: 'Orders' });
    } catch {
      Alert.alert('שגיאה', 'שגיאה בביצוע הזמנה');
    }
  };

  const handlePayLater = async () => {
    try {
      await completeOrder();
      navigation.navigate('Main', { screen: 'Orders' });
    } catch {
      Alert.alert('שגיאה', 'שגיאה בביצוע הזמנה');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.heading}>סיכום הזמנה</Text>
      <Text style={styles.subheading}>בחר אמצעי תשלום להשלמת ההזמנה</Text>

      <View style={styles.itemsBox}>
        {cart.map((item) => (
          <Card key={item._id} style={styles.itemCard}>
            <Card.Content style={styles.itemRow}>
              <Image
                source={{ uri: item.pic || 'https://placehold.co/60x60?text=?' }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text variant="titleSmall" style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemQty}>כמות: {item.quantity} × ₪{item.price}</Text>
              </View>
              <Text style={styles.itemPrice}>₪{item.price * item.quantity}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Divider style={styles.divider} />

      <View style={styles.totalRow}>
        <Text variant="titleMedium" style={styles.totalLabel}>סה"כ לתשלום</Text>
        <Text variant="titleMedium" style={styles.totalAmount}>₪{total}</Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={handleBit}
          buttonColor="#0080FF"
          style={styles.btn}
          contentStyle={styles.btnContent}
          labelStyle={styles.btnLabel}
        >
          שלם בביט
        </Button>
        <Button
          mode="outlined"
          onPress={handlePayLater}
          textColor="#6B7280"
          style={[styles.btn, styles.laterBtn]}
          contentStyle={styles.btnContent}
          labelStyle={styles.btnLabel}
        >
          אשלם מאוחר יותר
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 40 },
  heading: { color: '#1A1A1A', fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  subheading: { color: '#6B7280', textAlign: 'center', marginBottom: 20, fontSize: 14 },
  itemsBox: { backgroundColor: '#F8F9FA', borderRadius: 12, overflow: 'hidden', marginBottom: 8 },
  itemCard: { backgroundColor: '#F8F9FA', elevation: 0, borderRadius: 0 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemImage: { width: 60, height: 60, borderRadius: 8 },
  itemInfo: { flex: 1 },
  itemTitle: { color: '#1A1A1A', fontWeight: 'bold' },
  itemQty: { color: '#6B7280', marginTop: 2, fontSize: 13 },
  itemPrice: { color: '#FF6B00', fontWeight: 'bold', fontSize: 16 },
  divider: { marginVertical: 16, backgroundColor: '#E5E7EB' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 },
  totalLabel: { color: '#1A1A1A', fontWeight: 'bold' },
  totalAmount: { color: '#FF6B00', fontWeight: 'bold' },
  buttons: { gap: 12 },
  btn: { borderRadius: 10 },
  btnContent: { paddingVertical: 6 },
  btnLabel: { fontSize: 16 },
  laterBtn: { borderColor: '#E5E7EB' },
});

export default PaymentScreen;
