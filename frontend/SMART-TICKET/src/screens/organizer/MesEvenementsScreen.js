
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,ActivityIndicator  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors } from '../../theme/colors';

import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const getStatusConfig = (status) => {
  switch (status) {
    case 'active':
      return { label: 'En cours', color: colors.success, icon: 'checkmark-circle' };
    case 'draft':
      return { label: 'Brouillon', color: colors.warning, icon: 'create' };
    case 'completed':
      return { label: 'Terminé', color: colors.textMuted, icon: 'checkmark-done' };
    default:
      return { label: 'En cours', color: colors.success, icon: 'checkmark-circle' };
  }
};

const EventCard = ({ event, onPress }) => {
  const statusConfig = getStatusConfig(event.status || 'active');

  return (
    <TouchableOpacity style={styles.eventCard} onPress={onPress}>
      <View style={styles.eventHeader}>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
          <Ionicons name={statusConfig.icon} size={12} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
        </View>
      </View>

      <Text style={styles.eventTitle}>{event.name}</Text>

      <View style={styles.eventInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            {new Date(event.startDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>
      </View>

      <View style={styles.eventFooter}>
        <View>
          <Text style={styles.revenueLabel}>Prix</Text>
          <Text style={styles.revenueValue}>{event.price} €</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MesEvenementsScreen = ({ navigation, route }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ IF TOKEN IS PASSED VIA QUERY (route params)
  const tokenFromQuery = route?.params?.token;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // ✅ 1. Get JWT either from query OR AsyncStorage
     const token = tokenFromQuery || (await AsyncStorage.getItem('userToken')) || (await AsyncStorage.getItem('token'));
console.log('Using token:', token); 
      if (!token) {
        console.log('No token found');
        return;
      }

      const response = await fetch('http://192.168.1.104:3000/events/my', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setEvents(data.events);
      } else {
        console.log('API Error:', data.message);
      }
    } catch (error) {
      console.log('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Mes Événements</Text>
            <Text style={styles.headerSubtitle}>{events.length} événements</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreerEvenement')}
          >
            <Ionicons name="add" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Loader */}
        {loading && <ActivityIndicator size="large" color={colors.primary} />}

        {/* Events List */}
        {!loading && (
          <View style={styles.eventsList}>
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => navigation.navigate('DetailsEvenement', { event })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({ container: { flex: 1, }, contentContainer: { padding: 20, paddingBottom: 100, }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, }, headerTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 4, }, headerSubtitle: { fontSize: 14, color: colors.textSecondary, }, addButton: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', }, filterTabs: { flexDirection: 'row', marginBottom: 20, }, filterTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: colors.backgroundSecondary, }, filterTabActive: { backgroundColor: colors.primary, }, filterTabText: { fontSize: 13, fontWeight: '500', color: colors.textMuted, }, filterTabTextActive: { color: colors.textPrimary, }, eventsList: { marginBottom: 24, }, eventCard: { backgroundColor: colors.card, borderRadius: 18, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: colors.border, }, eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, }, statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, }, statusText: { marginLeft: 4, fontSize: 12, fontWeight: '600', }, moreButton: { padding: 4, }, eventTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 12, }, eventInfo: { marginBottom: 16, }, infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, }, infoText: { marginLeft: 8, fontSize: 13, color: colors.textSecondary, }, progressSection: { marginBottom: 16, }, progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, }, progressLabel: { fontSize: 13, color: colors.textSecondary, }, progressValue: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, }, progressBar: { height: 8, backgroundColor: colors.backgroundSecondary, borderRadius: 4, overflow: 'hidden', }, progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4, }, eventFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border, }, revenueInfo: {}, revenueLabel: { fontSize: 12, color: colors.textMuted, }, revenueValue: { fontSize: 18, fontWeight: '700', color: colors.success, }, editButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary + '20', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, }, editText: { marginLeft: 6, fontSize: 14, fontWeight: '500', color: colors.primary, }, placeholder: { alignItems: 'center', padding: 32, backgroundColor: colors.backgroundSecondary, borderRadius: 16, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', }, placeholderTitle: { marginTop: 12, fontSize: 16, fontWeight: '600', color: colors.textSecondary, }, placeholderText: { marginTop: 4, fontSize: 14, color: colors.textMuted, }, }); 
export default MesEvenementsScreen;