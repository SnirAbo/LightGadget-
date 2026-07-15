import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const ProductCardSkeleton = () => {
  const { colors, roundness } = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;
  const topRadius = roundness * 3; // 12px — matches Card top corners

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

  const block = (style) => (
    <Animated.View style={[{ backgroundColor: colors.surfaceVariant, opacity }, style]} />
  );

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Image placeholder — same 1:1 ratio as ProductCard */}
      <Animated.View
        style={[
          styles.imageBox,
          {
            backgroundColor: colors.surfaceVariant,
            borderTopLeftRadius: topRadius,
            borderTopRightRadius: topRadius,
            opacity,
          },
        ]}
      />

      <View style={styles.content}>
        {/* Name */}
        {block({ height: 14, borderRadius: 4, width: '80%' })}
        {/* Category */}
        {block({ height: 12, borderRadius: 4, width: '45%', marginTop: 6 })}
        {/* Price + chip row */}
        <View style={styles.priceRow}>
          {block({ height: 16, borderRadius: 4, width: '35%' })}
          {block({ height: 24, borderRadius: 12, width: '28%' })}
        </View>
      </View>

      {/* Button placeholder */}
      <View style={styles.actions}>
        {block({ height: 36, borderRadius: 8, width: '100%' })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card:     { flex: 1, margin: 6, elevation: 1, borderRadius: 12, overflow: 'hidden' },
  imageBox: { aspectRatio: 1 },
  content:  { padding: 8, paddingBottom: 0 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  actions:  { padding: 8, paddingTop: 4 },
});

export default ProductCardSkeleton;
