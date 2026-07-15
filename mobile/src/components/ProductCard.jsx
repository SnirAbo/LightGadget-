import { View, Image, StyleSheet } from 'react-native';
import { Card, Text, Chip, Button, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const ProductCard = ({ item, onAddToCart, onPress }) => {
  const { colors, roundness } = useTheme();
  const inStock = item.quantity > 0;
  // Match the top corners to Paper's Card border radius (3 × roundness = 12px)
  const topRadius = roundness * 3;

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]} onPress={onPress}>
      {/* 1:1 image — grey box + icon when no pic, no text */}
      <View
        style={[
          styles.imageBox,
          {
            backgroundColor: colors.surfaceVariant,
            borderTopLeftRadius: topRadius,
            borderTopRightRadius: topRadius,
          },
        ]}
      >
        {item.pic ? (
          <Image
            source={{ uri: item.pic }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={item.title}
          />
        ) : (
          <Ionicons name="image-outline" size={36} color={colors.onSurfaceVariant} />
        )}
      </View>

      <Card.Content style={styles.content}>
        {/* Name */}
        <Text variant="titleSmall" numberOfLines={1} style={{ color: colors.onSurface }}>
          {item.title}
        </Text>

        {/* Category */}
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 2 }}>
          {item.category}
        </Text>

        {/* Price + status — text label means color is never the only signal */}
        <View style={styles.priceRow}>
          <Text variant="titleMedium" style={{ color: colors.primary, fontWeight: '700' }}>
            ₪{item.price}
          </Text>
          <Chip
            compact
            style={{
              backgroundColor: inStock ? colors.successContainer : colors.errorContainer,
            }}
            textStyle={{
              color: inStock ? colors.onSuccessContainer : colors.onErrorContainer,
              fontSize: 11,
            }}
          >
            {inStock ? 'במלאי' : 'אזל המלאי'}
          </Chip>
        </View>
      </Card.Content>

      {/* Full-width CTA — borderRadius 8 overrides the roundness × 5 multiplier */}
      <Card.Actions style={styles.actions}>
        <Button
          mode="contained"
          onPress={() => onAddToCart(item)}
          disabled={!inStock}
          style={[styles.button, { borderRadius: 8 }]}
        >
          הוסף לעגלה
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card:      { flex: 1, margin: 6, elevation: 1 },
  imageBox:  { aspectRatio: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  image:     { width: '100%', height: '100%' },
  content:   { paddingTop: 8, paddingBottom: 0 },
  priceRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  actions:   { padding: 8, paddingTop: 4 },
  button:    { flex: 1 },
});

export default ProductCard;
