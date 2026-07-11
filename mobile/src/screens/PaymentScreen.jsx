import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Linking, Image } from 'react-native';
import { Text, Button, Divider, Card, TextInput, SegmentedButtons } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';

const SHIPPING_COST = 60;

const PaymentScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const currentUser = useSelector((state) => state.user.currentUser);

  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '', phoneNumber: '' });
  const [shippingOption, setShippingOption] = useState('free');

  const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingOption === 'paid' ? SHIPPING_COST : 0;
  const grandTotal = itemsTotal + shippingCost;

  const setField = (field) => (value) => setShipping((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const { address, city, postalCode, phoneNumber } = shipping;
    if (!address || !city || !postalCode || !phoneNumber) {
      Alert.alert('שגיאה', 'אנא מלא את כל פרטי המשלוח');
      return false;
    }
    return true;
  };

  const completeOrder = async () => {
    await api.post('/orders', {
      user: currentUser._id,
      items: cart.map((item) => ({
        product: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      ...shipping,
      shippingCost,
      totalPrice: grandTotal,
    });
    dispatch({ type: 'CLEAR_CART' });
  };

  const buildWaText = () => {
    const itemLines = cart.map(i => `${i.title} × ${i.quantity} = ₪${i.price * i.quantity}`).join('\n');
    const shippingLine = shippingCost > 0 ? `\nמשלוח: ₪${shippingCost}` : '\nמשלוח: חינם';
    return `🛒 הזמנה חדשה!\nשם: ${currentUser.firstName} ${currentUser.lastName}\nעיר: ${shipping.city}\nפריטים:\n${itemLines}${shippingLine}\nסה״כ: ₪${grandTotal}\nאנא אשר את ההזמנה 🙏`;
  };

  const handleBit = async () => {
    if (!validate()) return;
    try {
      await completeOrder();
      await Linking.openURL(`https://pay.bit.co.il/pay?phoneNumber=0538280217&amount=${grandTotal}`);
      await Linking.openURL(`https://wa.me/972538280217?text=${encodeURIComponent(buildWaText())}`);
      navigation.navigate('Main', { screen: 'Orders' });
    } catch {
      Alert.alert('שגיאה', 'שגיאה בביצוע הזמנה');
    }
  };

  const handlePayLater = async () => {
    if (!validate()) return;
    try {
      await completeOrder();
      await Linking.openURL(`https://wa.me/972538280217?text=${encodeURIComponent(buildWaText())}`);
      navigation.navigate('Main', { screen: 'Orders' });
    } catch {
      Alert.alert('שגיאה', 'שגיאה בביצוע הזמנה');
    }
  };

  const inputProps = {
    mode: 'outlined',
    outlineColor: '#E5E7EB',
    activeOutlineColor: '#FF6B00',
    textColor: '#1A1A1A',
    dense: true,
    style: styles.input,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.heading}>סיכום הזמנה</Text>
      <Text style={styles.subheading}>בחר אמצעי תשלום להשלמת ההזמנה</Text>

      {/* Order items */}
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

      {/* Shipping form */}
      <Text variant="titleMedium" style={styles.sectionTitle}>פרטי משלוח</Text>
      <TextInput label="כתובת" value={shipping.address} onChangeText={setField('address')} {...inputProps} />
      <TextInput label="עיר" value={shipping.city} onChangeText={setField('city')} {...inputProps} />
      <TextInput label="מיקוד" value={shipping.postalCode} onChangeText={setField('postalCode')} keyboardType="numeric" {...inputProps} />
      <TextInput label="טלפון" value={shipping.phoneNumber} onChangeText={setField('phoneNumber')} keyboardType="phone-pad" {...inputProps} />

      <SegmentedButtons
        value={shippingOption}
        onValueChange={setShippingOption}
        style={styles.segmented}
        buttons={[
          { value: 'free', label: '✅ טבריה — חינם', style: shippingOption === 'free' ? styles.segActiveBtn : undefined, labelStyle: shippingOption === 'free' ? styles.segActiveLabel : styles.segLabel },
          { value: 'paid', label: `📦 אחר — ₪${SHIPPING_COST}`, style: shippingOption === 'paid' ? styles.segActiveBtn : undefined, labelStyle: shippingOption === 'paid' ? styles.segActiveLabel : styles.segLabel },
        ]}
      />

      <Divider style={styles.divider} />

      {/* Totals */}
      <View style={styles.totalLine}>
        <Text style={styles.totalLineLabel}>מוצרים</Text>
        <Text style={styles.totalLineValue}>₪{itemsTotal}</Text>
      </View>
      <View style={styles.totalLine}>
        <Text style={styles.totalLineLabel}>משלוח</Text>
        <Text style={[styles.totalLineValue, shippingCost === 0 && styles.freeText]}>
          {shippingCost === 0 ? 'חינם' : `₪${shippingCost}`}
        </Text>
      </View>
      <Divider style={[styles.divider, { marginVertical: 8 }]} />
      <View style={styles.totalLine}>
        <Text variant="titleMedium" style={styles.totalLabel}>סה"כ לתשלום</Text>
        <Text variant="titleMedium" style={styles.totalAmount}>₪{grandTotal}</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Payment buttons */}
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
  sectionTitle: { color: '#1A1A1A', fontWeight: 'bold', marginBottom: 10 },
  input: { backgroundColor: '#F8F9FA', marginBottom: 8 },
  segmented: { marginTop: 8, marginBottom: 4 },
  segActiveBtn: { backgroundColor: '#FF6B00' },
  segActiveLabel: { color: '#FFFFFF', fontSize: 12 },
  segLabel: { fontSize: 12 },
  totalLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, marginBottom: 4 },
  totalLineLabel: { color: '#6B7280' },
  totalLineValue: { color: '#1A1A1A' },
  freeText: { color: '#22C55E' },
  totalLabel: { color: '#1A1A1A', fontWeight: 'bold' },
  totalAmount: { color: '#FF6B00', fontWeight: 'bold' },
  buttons: { gap: 12 },
  btn: { borderRadius: 10 },
  btnContent: { paddingVertical: 6 },
  btnLabel: { fontSize: 16 },
  laterBtn: { borderColor: '#E5E7EB' },
});

export default PaymentScreen;
