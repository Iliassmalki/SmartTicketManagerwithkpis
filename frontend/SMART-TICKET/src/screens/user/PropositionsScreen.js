// PropositionsScreen.tsx – Version FINALE compatible avec ton backend
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors } from '../../theme/colors';

const PropositionCard = ({ item, onPress }) => {
  const distance = item.distanceKm ? `${parseFloat(item.distanceKm).toFixed(1)} km` : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardImageContainer}>
        {item.picture ? (
          <Image source={{ uri: item.picture }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Ionicons name="image-outline" size={40} color={colors.textMuted} />
          </View>
        )}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{item.price} €</Text>
        </View>
        {distance && (
          <View style={styles.distanceBadge}>
            <Ionicons name="location" size={14} color="#fff" />
            <Text style={styles.distanceText}>{distance}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.cardInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              {new Date(item.startDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Voir détails</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PropositionsScreen = ({ route, navigation }) => {
  const { title = 'Événements', category } = route.params || {};
  
  const eventsData = route.params?.events?.data || [];
  console.log( eventsData);
  const hasMore = route.params?.events?.pagination?.hasMore || false;

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>
              {eventsData.length} événement{eventsData.length > 1 ? 's' : ''} trouvé{eventsData.length > 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Liste des événements */}
        <View style={styles.listContainer}>
          {eventsData.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="musical-notes-outline" size={80} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Aucun événement</Text>
              <Text style={styles.emptySubtitle}>
                Essaie une autre catégorie ou rapproche-toi
              </Text>
            </View>
          ) : (
            eventsData.map((event) => (
              <PropositionCard
                key={event.id}
                item={event}
                onPress={() =>
                  navigation.navigate('DetailsReservation', {
                    event,
                    categoryTitle: title,
                  })
                }
              />
            ))
          )}
        </View>

        {/* Indicateur "plus d'événements" */}
        {hasMore && (
          <View style={styles.loadMore}>
            <Text style={styles.loadMoreText}>Plus d'événements disponibles...</Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 10 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: { flex: 1, marginHorizontal: 16 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  headerSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: { paddingHorizontal: 20 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImageContainer: { height: 180, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  cardImagePlaceholder: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  priceText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  distanceBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distanceText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  cardInfo: { marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { marginLeft: 8, fontSize: 14, color: colors.textSecondary },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: { color: colors.primary, fontWeight: '600', fontSize: 12 },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bookButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  emptyState: { alignItems: 'center', paddingVertical: 100 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: colors.textSecondary, marginTop: 20 },
  emptySubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },
  loadMore: { alignItems: 'center', padding: 20 },
  loadMoreText: { color: colors.textMuted, fontStyle: 'italic' },
});

export default PropositionsScreen;