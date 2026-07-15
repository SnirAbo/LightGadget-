import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Chip, Searchbar, Text, Button, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import api from '../api/api';

const SKELETON_COUNT = 4;
const SKELETONS = Array.from({ length: SKELETON_COUNT }, (_, i) => ({ _id: String(i) }));

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const products = useSelector((state) => state.product.products);
  const categories = useSelector((state) => state.category.categories);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);
      dispatch({ type: 'LOAD_PRODUCT',  payload: productsRes.data });
      dispatch({ type: 'LOAD_CATEGORY', payload: categoriesRes.data });
    } catch {
      setError('לא הצלחנו לטעון את המוצרים. בדוק את החיבור ונסה שוב.');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = products.filter(
    (p) =>
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      p.title.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', payload: product });

  // --- Loading ---
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <FlatList
          data={SKELETONS}
          keyExtractor={(item) => item._id}
          renderItem={() => <ProductCardSkeleton />}
          numColumns={2}
          contentContainerStyle={styles.grid}
          scrollEnabled={false}
        />
      </View>
    );
  }

  // --- Error ---
  if (error) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.onSurfaceVariant} />
        <Text variant="titleMedium" style={[styles.stateTitle, { color: colors.onSurface }]}>
          {error}
        </Text>
        <Button mode="contained" onPress={fetchData} style={styles.retryButton}>
          נסה שוב
        </Button>
      </View>
    );
  }

  // --- Normal / Empty ---
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Searchbar
        placeholder="חיפוש..."
        value={search}
        onChangeText={setSearch}
        style={[styles.searchbar, { backgroundColor: colors.surface, borderColor: colors.outline }]}
        placeholderTextColor={colors.onSurfaceVariant}
        inputStyle={{ color: colors.onSurface }}
        iconColor={colors.onSurfaceVariant}
      />
      <FlatList
        horizontal
        data={[{ _id: 'all', name: 'All' }, ...categories]}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Chip
            style={[
              styles.categoryChip,
              { backgroundColor: colors.surface, borderColor: colors.outline },
              selectedCategory === item.name && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            textStyle={{ color: selectedCategory === item.name ? colors.onPrimary : colors.onSurface }}
            onPress={() => setSelectedCategory(item.name)}
          >
            {item.name === 'All' ? 'הכל' : item.name}
          </Chip>
        )}
        style={styles.categoryList}
        showsHorizontalScrollIndicator={false}
      />

      {filtered.length === 0 ? (
        // --- Empty state ---
        <View style={styles.centeredContainer}>
          <Ionicons name="search-outline" size={48} color={colors.onSurfaceVariant} />
          <Text variant="headlineSmall" style={[styles.stateTitle, { color: colors.onSurface }]}>
            לא נמצאו מוצרים
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
            נסה מונח אחר או עיין בקטגוריות
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onAddToCart={addToCart}
              onPress={() => navigation.navigate('Product', { productId: item._id })}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.grid}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container:         { flex: 1 },
  centeredContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  searchbar:         { margin: 12, elevation: 0, borderWidth: 1 },
  categoryList:      { paddingHorizontal: 12, marginBottom: 8, flexGrow: 0 },
  categoryChip:      { marginRight: 8, borderWidth: 1 },
  grid:              { paddingHorizontal: 8, paddingBottom: 16 },
  stateTitle:        { textAlign: 'center', marginTop: 8 },
  retryButton:       { marginTop: 8, borderRadius: 8 },
});

export default HomeScreen;
