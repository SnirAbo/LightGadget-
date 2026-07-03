import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, Button, Chip, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const categories = useSelector((state) => state.category.categories);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    api.get('/products').then((res) => dispatch({ type: 'LOAD_PRODUCT', payload: res.data }));
    api.get('/categories').then((res) => dispatch({ type: 'LOAD_CATEGORY', payload: res.data }));
  }, []);

  const filtered = products.filter(
    (p) =>
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      p.title.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', payload: product });

  const renderProduct = ({ item }) => (
    <Card style={styles.card}>
      {item.pic ? <Card.Cover source={{ uri: item.pic }} style={styles.cover} /> : null}
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" style={styles.productTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text variant="bodySmall" style={styles.category}>
          {item.category}
        </Text>
        <Text variant="titleSmall" style={styles.price}>
          ₪{item.price}
        </Text>
        <Chip
          style={[styles.chip, { backgroundColor: item.quantity > 0 ? '#22C55E' : '#EF4444' }]}
          textStyle={{ color: '#fff', fontSize: 11 }}
        >
          {item.quantity > 0 ? 'במלאי' : 'אזל המלאי'}
        </Chip>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => addToCart(item)}
          disabled={item.quantity === 0}
          buttonColor="#FF6B00"
          style={styles.cartButton}
        >
          הוסף לעגלה
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="חיפוש..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchbar}
        placeholderTextColor="#6B7280"
        inputStyle={{ color: '#1A1A1A' }}
        iconColor="#6B7280"
      />
      <FlatList
        horizontal
        data={[{ _id: 'all', name: 'All' }, ...categories]}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Chip
            style={[styles.categoryChip, selectedCategory === item.name && styles.selectedChip]}
            textStyle={{ color: selectedCategory === item.name ? '#FFFFFF' : '#1A1A1A' }}
            onPress={() => setSelectedCategory(item.name)}
          >
            {item.name === 'All' ? 'הכל' : item.name}
          </Chip>
        )}
        style={styles.categoryList}
        showsHorizontalScrollIndicator={false}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  searchbar: { margin: 12, backgroundColor: '#F8F9FA', elevation: 0, borderWidth: 1, borderColor: '#E5E7EB' },
  categoryList: { paddingHorizontal: 12, marginBottom: 8, flexGrow: 0 },
  categoryChip: { marginRight: 8, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E5E7EB' },
  selectedChip: { backgroundColor: '#FF6B00', borderColor: '#FF6B00' },
  grid: { paddingHorizontal: 8, paddingBottom: 16 },
  card: { flex: 1, margin: 6, backgroundColor: '#F8F9FA', elevation: 1 },
  cover: { height: 130 },
  cardContent: { paddingVertical: 8 },
  productTitle: { color: '#1A1A1A', fontWeight: 'bold' },
  category: { color: '#6B7280', marginTop: 2 },
  price: { color: '#FF6B00', marginTop: 4, fontWeight: 'bold' },
  chip: { marginTop: 6, alignSelf: 'flex-start' },
  cartButton: { flex: 1 },
});

export default HomeScreen;
