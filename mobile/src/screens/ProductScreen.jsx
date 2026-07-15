import { useEffect, useRef, useState, useCallback } from 'react';
import { View, Image, ScrollView, Animated, StyleSheet } from 'react-native';
import { Text, Chip, Button, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import api from '../api/api';

// --- Skeleton -----------------------------------------------------------------

const Skeleton = ({ style }) => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1,   duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return <Animated.View style={[{ backgroundColor: colors.surfaceVariant, opacity }, style]} />;
};

const ProductScreenSkeleton = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const BAR_HEIGHT = 72 + insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: BAR_HEIGHT }}>
        {/* Image */}
        <Skeleton style={styles.skeletonImage} />
        <View style={styles.detail}>
          {/* Name */}
          <Skeleton style={{ height: 24, borderRadius: 6, width: '75%' }} />
          {/* Category */}
          <Skeleton style={{ height: 16, borderRadius: 4, width: '40%', marginTop: 10 }} />
          {/* Price */}
          <Skeleton style={{ height: 36, borderRadius: 6, width: '45%', marginTop: 16 }} />
          {/* Stock chip */}
          <Skeleton style={{ height: 28, borderRadius: 14, width: '28%', marginTop: 12 }} />
          {/* Description lines */}
          <Skeleton style={{ height: 14, borderRadius: 4, width: '100%', marginTop: 24 }} />
          <Skeleton style={{ height: 14, borderRadius: 4, width: '90%',  marginTop: 8 }} />
          <Skeleton style={{ height: 14, borderRadius: 4, width: '70%',  marginTop: 8 }} />
        </View>
      </ScrollView>
    </View>
  );
};

// --- Screen ------------------------------------------------------------------

export default function ProductScreen({ route, navigation }) {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.get(`/products/${productId}`);
      setProduct(res.data);
      navigation.setOptions({ title: res.data.title });
    } catch {
      setError('לא הצלחנו לטעון את המוצר. בדוק את החיבור ונסה שוב.');
    } finally {
      setLoading(false);
    }
  }, [productId, navigation]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  const addToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  // Sticky bar height: fixed content (16 top + button ~44 + 16 bottom) + safe area
  const STICKY_BAR_HEIGHT = 88 + insets.bottom;
  const inStock = product?.quantity > 0;

  if (loading) return <ProductScreenSkeleton />;

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="cloud-offline-outline" size={48} color={colors.onSurfaceVariant} />
        <Text variant="titleMedium" style={[styles.errorText, { color: colors.onSurface }]}>
          {error}
        </Text>
        <Button mode="contained" onPress={fetchProduct} style={styles.retryButton}>
          נסה שוב
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: STICKY_BAR_HEIGHT }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image — 1:1, same no-image placeholder as ProductCard */}
        <View style={[styles.imageBox, { backgroundColor: colors.surfaceVariant }]}>
          {product.pic ? (
            <Image
              source={{ uri: product.pic }}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel={product.title}
            />
          ) : (
            <Ionicons name="image-outline" size={56} color={colors.onSurfaceVariant} />
          )}
        </View>

        <View style={styles.detail}>
          {/* Name */}
          <Text variant="headlineMedium" style={{ color: colors.onSurface, fontWeight: '700' }}>
            {product.title}
          </Text>

          {/* Category */}
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginTop: 4 }}>
            {product.category}
          </Text>

          {/* Price — largest element after the title */}
          <Text style={[styles.price, { color: colors.primary }]}>
            ₪{product.price}
          </Text>

          {/* Stock — text label so color is never the only signal */}
          <Chip
            compact
            style={{
              alignSelf: 'flex-start',
              marginTop: 12,
              backgroundColor: inStock ? colors.successContainer : colors.errorContainer,
            }}
            textStyle={{
              color: inStock ? colors.onSuccessContainer : colors.onErrorContainer,
              fontSize: 12,
            }}
          >
            {inStock ? 'במלאי' : 'אזל המלאי'}
          </Chip>

          {/* Description */}
          {product.description ? (
            <Text variant="bodyMedium" style={[styles.description, { color: colors.onSurface }]}>
              {product.description}
            </Text>
          ) : null}
        </View>
      </ScrollView>

      {/* Sticky buy bar — never scrolls off screen */}
      <View
        style={[
          styles.stickyBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.outline,
            paddingBottom: 16 + insets.bottom,
          },
        ]}
      >
        <Button
          mode="contained"
          onPress={addToCart}
          disabled={!inStock}
          style={styles.buyButton}
        >
          הוסף לעגלה
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  centered:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  errorText:    { textAlign: 'center', marginTop: 8 },
  retryButton:  { marginTop: 8, borderRadius: 8 },

  // Skeleton
  skeletonImage: { aspectRatio: 1, width: '100%' },

  // Image
  imageBox: { aspectRatio: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
  image:    { width: '100%', height: '100%' },

  // Detail content
  detail:      { padding: 16 },
  price:       { fontSize: 32, fontWeight: '700', marginTop: 16 },
  description: { marginTop: 20, lineHeight: 24 },

  // Sticky bar
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  buyButton: { borderRadius: 8 },
});
