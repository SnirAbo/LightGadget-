import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Text, Button, TextInput, Card, Menu, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import api from '../api/api';

const STATUS_HE = { pending: 'ממתין', shipped: 'נשלח', delivered: 'הושלם' };
const STATUS_CHIP = {
  pending: { bg: '#E5E7EB', text: '#6B7280' },
  shipped:  { bg: '#DBEAFE', text: '#1D4ED8' },
  delivered:{ bg: '#D1FAE5', text: '#065F46' },
};

const AdminScreen = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);
  const products = useSelector((state) => state.product.products);
  const [tab, setTab] = useState('categories');
  const [newCatName, setNewCatName] = useState('');
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: 0,
    quantity: 0,
    category: '',
    description: '',
    pic: '',
  });

  // orders state
  const [orders, setOrders] = useState([]);
  const [statusMenuId, setStatusMenuId] = useState(null);

  // image upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  const pickAndUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('הרשאה נדרשת', 'האפליקציה צריכה גישה לגלריה כדי לבחור תמונה');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: asset.uri,
        name: asset.fileName ?? 'photo.jpg',
        type: asset.mimeType ?? 'image/jpeg',
      });
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setField('pic')(res.data.url);
    } catch {
      Alert.alert('שגיאה', 'שגיאה בהעלאת התמונה');
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchCategories = () =>
    api.get('/categories').then((res) => dispatch({ type: 'LOAD_CATEGORY', payload: res.data }));
  const fetchProducts = () =>
    api.get('/products').then((res) => dispatch({ type: 'LOAD_PRODUCT', payload: res.data }));
  const fetchOrders = () =>
    api.get('/orders').then((res) => setOrders(res.data)).catch(() => {});

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (tab === 'orders') fetchOrders();
  }, [tab]);

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await api.post('/categories', { name: newCatName });
      setNewCatName('');
      fetchCategories();
    } catch {
      Alert.alert('שגיאה', 'שגיאה בהוספת קטגוריה');
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch {
      Alert.alert('שגיאה', 'שגיאה במחיקת קטגוריה');
    }
  };

  const addProduct = async () => {
    const required = ['title', 'price', 'category', 'description'];
    if (required.some((f) => !newProduct[f])) {
      Alert.alert('שגיאה', 'אנא מלא שם, מחיר, קטגוריה ותיאור');
      return;
    }
    try {
      await api.post('/products', {
        ...newProduct,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity) || 0,
      });
      setNewProduct({ title: '', price: '', quantity: '', category: '', description: '', pic: '' });
      fetchProducts();
    } catch {
      Alert.alert('שגיאה', 'שגיאה בהוספת מוצר');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      Alert.alert('שגיאה', 'שגיאה במחיקת מוצר');
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}`, { status: newStatus });
      fetchOrders();
    } catch {
      Alert.alert('שגיאה', 'שגיאה בעדכון סטטוס');
    }
  };

  const setField = (field) => (val) => setNewProduct((prev) => ({ ...prev, [field]: val }));

  const inputProps = {
    mode: 'outlined',
    textColor: '#1A1A1A',
    outlineColor: '#E5E7EB',
    activeOutlineColor: '#FF6B00',
    dense: true,
    style: styles.input,
  };

  const TabBtn = ({ id, label }) => (
    <Button
      mode={tab === id ? 'contained' : 'outlined'}
      onPress={() => setTab(id)}
      buttonColor={tab === id ? '#FF6B00' : undefined}
      textColor={tab === id ? '#fff' : '#FF6B00'}
      style={styles.tabBtn}
    >
      {label}
    </Button>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.heading}>פאנל ניהול</Text>

      <View style={styles.tabs}>
        <TabBtn id="categories" label="קטגוריות" />
        <TabBtn id="products" label="מוצרים" />
        <TabBtn id="orders" label="הזמנות" />
      </View>

      {tab === 'categories' && (
        <View style={{ flex: 1 }}>
          <View style={styles.addRow}>
            <TextInput
              label="קטגוריה חדשה"
              value={newCatName}
              onChangeText={setNewCatName}
              mode="outlined"
              textColor="#1A1A1A"
              outlineColor="#E5E7EB"
              activeOutlineColor="#FF6B00"
              dense
              style={[styles.addInput, { backgroundColor: '#F8F9FA' }]}
            />
            <Button mode="contained" onPress={addCategory} buttonColor="#22C55E" style={styles.addBtn}>
              הוסף
            </Button>
          </View>
          <FlatList
            data={categories}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Content style={styles.row}>
                  <Text style={styles.itemText}>{item.name}</Text>
                  <Button mode="text" onPress={() => deleteCategory(item._id)} textColor="#EF4444">
                    מחק
                  </Button>
                </Card.Content>
              </Card>
            )}
          />
        </View>
      )}

      {tab === 'products' && (
        <ScrollView>
          <Card style={[styles.card, { marginBottom: 12 }]}>
            <Card.Content>
              <Text variant="titleSmall" style={[styles.itemText, { marginBottom: 8 }]}>
                מוצר חדש
              </Text>
              <TextInput label="שם" value={newProduct.title} onChangeText={setField('title')} {...inputProps} />
              <TextInput label="מחיר" value={newProduct.price} onChangeText={setField('price')} keyboardType="numeric" {...inputProps} />
              <TextInput label="כמות" value={newProduct.quantity} onChangeText={setField('quantity')} keyboardType="numeric" {...inputProps} />
              <Menu
                visible={categoryMenuVisible}
                onDismiss={() => setCategoryMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setCategoryMenuVisible(true)}
                    style={styles.categoryBtn}
                    contentStyle={styles.categoryBtnContent}
                    labelStyle={[styles.categoryBtnLabel, newProduct.category ? { color: '#1A1A1A' } : { color: '#9CA3AF' }]}
                  >
                    {newProduct.category || 'בחר קטגוריה'}
                  </Button>
                }
              >
                {categories.map((cat) => (
                  <Menu.Item
                    key={cat._id}
                    onPress={() => { setField('category')(cat.name); setCategoryMenuVisible(false); }}
                    title={cat.name}
                  />
                ))}
              </Menu>
              <TextInput label="תיאור" value={newProduct.description} onChangeText={setField('description')} {...inputProps} />
              <Button
                mode="outlined"
                onPress={pickAndUploadImage}
                disabled={uploadingImage}
                style={styles.pickerBtn}
                textColor="#FF6B00"
                icon="image"
              >
                {uploadingImage ? 'מעלה תמונה...' : 'בחר תמונה מהגלריה'}
              </Button>
              {uploadingImage && (
                <ActivityIndicator color="#FF6B00" style={{ marginBottom: 8 }} />
              )}
              {newProduct.pic ? (
                <Image source={{ uri: newProduct.pic }} style={styles.picPreview} resizeMode="cover" />
              ) : null}
              <TextInput label="תמונה (URL)" value={newProduct.pic} onChangeText={setField('pic')} {...inputProps} />
              <Button mode="contained" onPress={addProduct} buttonColor="#22C55E">
                הוסף מוצר
              </Button>
            </Card.Content>
          </Card>
          {products.map((item) => (
            <Card key={item._id} style={styles.card}>
              <Card.Content style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemText}>{item.title}</Text>
                  <Text style={styles.detail}>₪{item.price} · מלאי: {item.quantity}</Text>
                </View>
                <Button mode="text" onPress={() => deleteProduct(item._id)} textColor="#EF4444">
                  מחק
                </Button>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}

      {tab === 'orders' && (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={orders.length === 0 && styles.emptyContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>אין הזמנות</Text>}
          renderItem={({ item }) => {
            const chipStyle = STATUS_CHIP[item.status] ?? STATUS_CHIP.pending;
            return (
              <Card style={styles.card}>
                <Card.Content>
                  {/* Header row: customer + date */}
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemText}>
                        {item.user ? `${item.user.firstName} ${item.user.lastName}` : '—'}
                      </Text>
                      <Text style={styles.detail}>
                        {new Date(item.createdAt).toLocaleDateString('he-IL')}
                      </Text>
                    </View>
                    <Menu
                      visible={statusMenuId === item._id}
                      onDismiss={() => setStatusMenuId(null)}
                      anchor={
                        <Chip
                          onPress={() => setStatusMenuId(item._id)}
                          style={[styles.chip, { backgroundColor: chipStyle.bg }]}
                          textStyle={{ color: chipStyle.text, fontSize: 12 }}
                        >
                          {STATUS_HE[item.status] ?? item.status}
                        </Chip>
                      }
                    >
                      {Object.entries(STATUS_HE).map(([val, label]) => (
                        <Menu.Item
                          key={val}
                          title={label}
                          onPress={() => {
                            setStatusMenuId(null);
                            updateOrderStatus(item._id, val);
                          }}
                        />
                      ))}
                    </Menu>
                  </View>

                  {/* Items */}
                  <View style={styles.section}>
                    {item.items?.map((line, i) => (
                      <Text key={i} style={styles.detail}>{line.title} × {line.quantity}</Text>
                    ))}
                  </View>

                  {/* Address */}
                  <View style={styles.section}>
                    {item.address ? <Text style={styles.detail}>כתובת: {item.address}</Text> : null}
                    {item.city ? <Text style={styles.detail}>עיר: {item.city}</Text> : null}
                    {item.postalCode ? <Text style={styles.detail}>מיקוד: {item.postalCode}</Text> : null}
                    {item.phoneNumber ? <Text style={styles.detail}>טלפון: {item.phoneNumber}</Text> : null}
                  </View>

                  {/* Totals */}
                  <View style={[styles.row, { marginTop: 4 }]}>
                    <Text style={styles.detail}>
                      משלוח: {item.shippingCost === 0 ? 'חינם' : `₪${item.shippingCost}`}
                    </Text>
                    <Text style={styles.orderTotal}>₪{item.totalPrice}</Text>
                  </View>
                </Card.Content>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 12 },
  heading: { color: '#1A1A1A', fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  tabs: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  tabBtn: { flex: 1 },
  addRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'center', gap: 8 },
  addInput: { flex: 1 },
  addBtn: { marginTop: 4 },
  card: { marginBottom: 8, backgroundColor: '#F8F9FA', elevation: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemText: { color: '#1A1A1A', fontWeight: 'bold' },
  detail: { color: '#6B7280', marginTop: 2, fontSize: 13 },
  input: { marginBottom: 8, backgroundColor: '#F8F9FA' },
  categoryBtn: { marginBottom: 8, borderColor: '#E5E7EB', borderRadius: 4, justifyContent: 'flex-start' },
  categoryBtnContent: { justifyContent: 'flex-start' },
  categoryBtnLabel: { fontSize: 14 },
  chip: { borderRadius: 12 },
  section: { marginTop: 6 },
  orderTotal: { color: '#FF6B00', fontWeight: 'bold', fontSize: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#6B7280', fontSize: 16, textAlign: 'center', marginTop: 40 },
  pickerBtn: { marginBottom: 8, borderColor: '#FF6B00' },
  picPreview: { width: '100%', height: 160, borderRadius: 8, marginBottom: 8 },
});

export default AdminScreen;
