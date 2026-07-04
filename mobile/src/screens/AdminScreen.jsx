import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { Text, Button, TextInput, Card, Menu } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';

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

 
  const fetchCategories = () =>
    api.get('/categories').then((res) => dispatch({ type: 'LOAD_CATEGORY', payload: res.data }));
  const fetchProducts = () =>
    api.get('/products').then((res) => dispatch({ type: 'LOAD_PRODUCT', payload: res.data }));

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

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

  const setField = (field) => (val) => setNewProduct((prev) => ({ ...prev, [field]: val }));

  const inputProps = {
    mode: 'outlined',
    textColor: '#1A1A1A',
    outlineColor: '#E5E7EB',
    activeOutlineColor: '#FF6B00',
    dense: true,
    style: styles.input,
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.heading}>פאנל ניהול</Text>

      <View style={styles.tabs}>
        <Button
          mode={tab === 'categories' ? 'contained' : 'outlined'}
          onPress={() => setTab('categories')}
          buttonColor={tab === 'categories' ? '#FF6B00' : undefined}
          textColor={tab === 'categories' ? '#fff' : '#FF6B00'}
          style={styles.tabBtn}
        >
          קטגוריות
        </Button>
        <Button
          mode={tab === 'products' ? 'contained' : 'outlined'}
          onPress={() => setTab('products')}
          buttonColor={tab === 'products' ? '#FF6B00' : undefined}
          textColor={tab === 'products' ? '#fff' : '#FF6B00'}
          style={styles.tabBtn}
        >
          מוצרים
        </Button>
      </View>

      {tab === 'categories' ? (
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
      ) : (
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
  detail: { color: '#6B7280', marginTop: 2 },
  input: { marginBottom: 8, backgroundColor: '#F8F9FA' },
  categoryBtn: { marginBottom: 8, borderColor: '#E5E7EB', borderRadius: 4, justifyContent: 'flex-start' },
  categoryBtnContent: { justifyContent: 'flex-start' },
  categoryBtnLabel: { fontSize: 14 },
});

export default AdminScreen;
