import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const CategoryCard = ({ title, icon, color, onPress, count }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, { borderColor: color + '40' }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {count !== undefined && (
        <View style={[styles.countBadge, { backgroundColor: color }]}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      )}
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={colors.textMuted} 
        style={styles.arrow}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  arrow: {
    marginLeft: 4,
  },
});

export default CategoryCard;


