import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import ScreenWrapper from '../../components/ScreenWrapper';
import CategoryCard from '../../components/CategoryCard';
import ProfileMenu from '../../components/ProfileMenu';
import { colors, categoryColors } from '../../theme/colors';

const API_URL = "http://192.168.1.104:3000"; // ✅ Your backend

const BASE_CATEGORIES = [
  { id: 'MUSIC', title: 'Music', icon: 'musical-notes-outline', color: categoryColors.clubs },
  { id: 'SPORT', title: 'Sport', icon: 'football-outline', color: categoryColors.matchs },
  { id: 'ART', title: 'Art', icon: 'film-outline', color: categoryColors.cinema },
  { id: 'TECH', title: 'Tech', icon: 'hardware-chip-outline', color: categoryColors.transport },
  { id: 'LOISIRS', title: 'Loisirs', icon: 'game-controller-outline', color: categoryColors.restaurants },
];

const AccueilUtilisateurScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    getUserLocation();
  }, []);
const handleCategoryPress = async (category) => {
  let userLat = null;
  let userLng = null;

  try {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      userLat = loc.coords.latitude;
      userLng = loc.coords.longitude;
    } else {
      userLat = 33.5731;
      userLng = -7.5898;
    }

    const categoryQuery = category?.id ? `&category=${encodeURIComponent(category.id)}` : '';
    const url = `http://192.168.1.104:3000/events/nearby?lat=${userLat}&lng=${userLng}${categoryQuery}`;

    console.log('URL appelée :', url);

    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP ' + response.status);

    const data = await response.json();

    console.log('Données reçues du backend :', data);  // ← tu verras le vrai JSON

    // CORRECTION : on passe TOUT le data.events
    navigation.navigate('Propositions', {
      title: category?.title || 'Événements proches',
      category: category?.id || null,
      events: data.events || { data: [], pagination: { hasMore: false } },  // ← CORRIGÉ
      userLocation: { latitude: userLat, longitude: userLng },
    });

  } catch (error) {
    console.error('Erreur fetch événements :', error);
    Alert.alert('Erreur', 'Impossible de charger les événements');

    navigation.navigate('Propositions', {
      title: category?.title || 'Événements',
      events: { data: [], pagination: { hasMore: false } },
    });
  }
};


  // ✅ 1. GET USER LOCATION
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'La localisation est nécessaire.');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = userLocation.coords;
      setLocation({ latitude, longitude });

      fetchNearbyEvents(latitude, longitude);

    } catch (error) {
      console.log('❌ Location error:', error);
    }
  };

  // ✅ 2. FETCH NEARBY EVENTS
  const fetchNearbyEvents = async (lat, lng) => {
    try {
      setLoadingEvents(true);

      const response = await fetch(
        `${API_URL}/events/nearby?lat=${lat}&lng=${lng}`
      );

      const data = await response.json();

      setNearbyEvents(data.events.data);

      console.log("✅ Nearby events loaded:", data.events.data.length);

    } catch (error) {
      console.log('❌ API error:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  // ✅ 3. AUTO-CLASSIFY EVENTS BY CATEGORY
  const categoriesWithCounts = useMemo(() => {
    const counts = nearbyEvents.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {});

    return BASE_CATEGORIES.map(cat => ({
      ...cat,
      count: counts[cat.id] || 0,
    }));
  }, [nearbyEvents]);

  return (
    <ScreenWrapper>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour ! 👋</Text>
            <Text style={styles.headerTitle}>Découvrez nos espaces</Text>

            {location && (
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </Text>
            )}
          </View>
          <ProfileMenu />
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Rechercher un événement...</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {loadingEvents ? '...' : nearbyEvents.length}
            </Text>
            <Text style={styles.statLabel}>Événements proches</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{BASE_CATEGORIES.length}</Text>
            <Text style={styles.statLabel}>Catégories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24h</Text>
            <Text style={styles.statLabel}>Support</Text>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explorer par catégorie</Text>
          <Ionicons name="grid-outline" size={20} color={colors.primary} />
        </View>

       {/* ✅ DYNAMIC CATEGORY LIST */}
<View style={styles.categoriesContainer}>
  {categoriesWithCounts.map((category) => (
    <CategoryCard
      key={category.id}
      title={category.title}
      icon={category.icon}
      color={category.color}
      count={category.count}
      onPress={() => handleCategoryPress(category)}
    />
  ))}
</View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: colors.textPrimary },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundSecondary, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  searchPlaceholder: { marginLeft: 12, fontSize: 15, color: colors.textMuted },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 16, alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: colors.border },
  statNumber: { fontSize: 24, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  categoriesContainer: { marginTop: 4 },
});

export default AccueilUtilisateurScreen;
