import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors, categoryColors } from '../../theme/colors';

const categories = [
  { id: 'all', name: 'Tous', icon: 'apps-outline' },
  { id: 'SPORT', name: 'Sport', icon: 'football-outline', color: categoryColors.matchs },
  { id: 'MUSIC', name: 'Musique', icon: 'musical-notes-outline', color: categoryColors.clubs },
  { id: 'ART', name: 'Art', icon: 'film-outline', color: categoryColors.cinema },
  { id: 'TECH', name: 'Tech', icon: 'laptop-outline', color: categoryColors.restaurants },
  { id: 'OTHER', name: 'Autres', icon: 'apps-outline' },
];

const GeolocationScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ OPEN GOOGLE MAPS WITH DIRECTIONS
  const openGoogleMaps = (latitude, longitude, eventName) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Erreur', 'Impossible d\'ouvrir Google Maps');
    });
  };

  // ✅ FETCH NEARBY EVENTS
  useEffect(() => {
    const fetchNearbyEvents = async () => {
      try {
        const res = await fetch(
          'http://192.168.1.104:3000/events/nearby?lat=33.5527503&lng=-7.6354246'
        );

        const json = await res.json();
        setEvents(json.events.data);
      } catch (err) {
        console.log('Erreur fetch nearby:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyEvents();
  }, []);

  // ✅ CATEGORY FILTER (Frontend)
  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  // ✅ SORT BY DISTANCE
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return parseFloat(a.distanceKm) - parseFloat(b.distanceKm);
  });

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement des événements...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Près de vous 📍</Text>
            <Text style={styles.headerSubtitle}>Événements à proximité</Text>
          </View>
          <TouchableOpacity style={styles.mapButton}>
            <Ionicons name="map" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* LOCATION STATUS */}
        <View style={styles.locationStatus}>
          <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
          <Text style={styles.locationText}>Localisation active • Casablanca</Text>
          <Text style={styles.changeText}>Modifier</Text>
        </View>

        {/* CATEGORY FILTER */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons 
                name={cat.icon} 
                size={18} 
                color={selectedCategory === cat.id ? '#fff' : colors.textMuted} 
              />
              <Text style={[
                styles.categoryChipText,
                selectedCategory === cat.id && styles.categoryChipTextActive,
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SORT ROW */}
        <View style={styles.sortRow}>
          <Text style={styles.resultsCount}>{sortedEvents.length} résultats</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'distance' && styles.sortButtonActive]}
              onPress={() => setSortBy('distance')}
            >
              <Ionicons name="arrow-down" size={14} color={sortBy === 'distance' ? colors.primary : colors.textMuted} />
              <Text style={[styles.sortText, sortBy === 'distance' && styles.sortTextActive]}>
                Distance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'price' && styles.sortButtonActive]}
              onPress={() => setSortBy('price')}
            >
              <Ionicons name="pricetag" size={14} color={sortBy === 'price' ? colors.primary : colors.textMuted} />
              <Text style={[styles.sortText, sortBy === 'price' && styles.sortTextActive]}>
                Prix
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* EVENTS LIST */}
        <View style={styles.eventsList}>
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() =>
                  navigation.navigate('DetailsReservation', {
                    event,
                    categoryTitle: 'À proximité',
                  })
                }
              >
                <View style={styles.eventImage}>
                  {event.picture ? (
                    <Image 
                      source={{ uri: event.picture }} 
                      style={styles.eventImageContent}
                    />
                  ) : (
                    <Ionicons name="image-outline" size={40} color={colors.textMuted} />
                  )}
                </View>
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventName}>{event.name}</Text>
                    <View style={styles.distanceBadge}>
                      <Ionicons name="location" size={12} color={colors.primary} />
                      <Text style={styles.distanceText}>{parseFloat(event.distanceKm).toFixed(2)} km</Text>
                    </View>
                  </View>

                  <View style={styles.addressRow}>
                    <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.addressText} numberOfLines={1}>{event.location}</Text>
                  </View>

                  <View style={styles.eventFooter}>
                    <View style={styles.dateRow}>
                      <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                      <Text style={styles.dateText}>Voir détails</Text>
                    </View>
                    <Text style={styles.priceText}>{event.price} MAD</Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.directionsButton}
                      onPress={() => openGoogleMaps(event.latitude, event.longitude, event.name)}
                    >
                      <Ionicons name="navigate" size={16} color={colors.primary} />
                      <Text style={styles.directionsText}>Itinéraire</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bookButton}>
                      <Text style={styles.bookText}>Réserver</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Aucun événement trouvé</Text>
              <Text style={styles.emptySubtitle}>Essayez une autre catégorie</Text>
            </View>
          )}
        </View>

        {/* MAP CTA */}
        <TouchableOpacity style={styles.mapCTA}>
          <Ionicons name="map" size={32} color={colors.primary} />
          <View style={styles.mapCTAContent}>
            <Text style={styles.mapCTATitle}>Voir sur la carte</Text>
            <Text style={styles.mapCTASubtitle}>Explorez les événements à proximité</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  mapButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  locationText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  changeText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  categoriesScroll: {
    marginBottom: 20,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoriesContent: {
    gap: 8,
    flexDirection: 'row',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    marginRight: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
  },
  categoryChipText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: colors.primary,
  },
  sortText: {
    marginLeft: 4,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  sortTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  eventsList: {
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  eventCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  eventImage: {
    height: 140,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    overflow: 'hidden',
  },
  eventImageContent: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  eventName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  distanceText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 8,
  },
  addressText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  directionsText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  bookButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bookText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  mapCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  mapCTAContent: {
    flex: 1,
    marginLeft: 14,
  },
  mapCTATitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  mapCTASubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '400',
  },
});

export default GeolocationScreen;