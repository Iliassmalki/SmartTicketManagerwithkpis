// screens/DetailsReservationScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsReservationScreen = ({ route, navigation }) => {
  const {isUserLoggedIn } = useAuth();

   // ✅ Get params from navigation
  const { event: passedEvent, categoryTitle } = route.params;
  const eventId = passedEvent.id;

  // ✅ STATE (THIS FIXES YOUR ERROR)
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    } else {
      setLoading(false);
      Alert.alert('Erreur', 'Aucun événement sélectionné');
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
console.log('Fetching details for event ID:', eventId);
      const response = await fetch(`http://192.168.1.104:3000/events/${eventId}`, {
        headers,
      });

      if (!response.ok) throw new Error('Impossible de charger l\'événement');

      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error('Erreur fetch event:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails de l\'événement');
    } finally {
      setLoading(false);
    }

  };

  const handleReservation = () => {
    if (!isUserLoggedIn) {
      navigation.navigate('Login', {
        returnTo: { screen: 'DetailsReservation', params: { eventId } },
      });
      return;
    }
    setShowConfirmModal(true);
  };

const confirmReservation = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await fetch(`http://192.168.1.104:3000/events/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        eventId: event.id,     // ✅ correct place
                
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors du paiement');
    }
 navigation.navigate('TicketQRCode', {
      ticket: data.ticket,
    });
    
  } catch (error) {
    console.error('Erreur paiement:', error);
    Alert.alert('Erreur', error.message);
  }
};


  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement de l'événement...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!event) {
    return (
      <ScreenWrapper>
        <View style={styles.error}>
          <Ionicons name="alert-circle-outline" size={80} color={colors.error} />
          <Text style={styles.errorText}>Événement non trouvé</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Back & Favorite */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          {event.picture ? (
            <Image source={{ uri: event.picture }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={80} color={colors.textMuted} />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{event.name}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          </View>

          {/* Info Cards */}
          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <Ionicons name="calendar" size={24} color={colors.primary} />
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>
                {new Date(event.startDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="location" size={24} color={colors.secondary} />
              <Text style={styles.infoLabel}>Lieu</Text>
              <Text style={styles.infoValue}>{event.location}</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="pricetag" size={24} color={colors.accent} />
              <Text style={styles.infoLabel}>Prix</Text>
              <Text style={styles.infoValue}>{event.price} €</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {event.description || 'Aucune description disponible pour cet événement.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Prix total</Text>
          <Text style={styles.priceValue}>{event.price} €</Text>
        </View>
        <TouchableOpacity style={styles.reserveButton} onPress={handleReservation}>
          <Text style={styles.reserveButtonText}>
            {isUserLoggedIn ? 'Réserver maintenant' : 'Connexion requise'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Modal Confirmation */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="ticket" size={60} color={colors.primary} />
            <Text style={styles.modalTitle}>Confirmer la réservation</Text>
            <Text style={styles.modalSubtitle}>{event.name}</Text>
            <Text style={styles.modalPrice}>{event.price} €</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowConfirmModal(false)}>
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={confirmReservation}>
                <Text style={styles.modalConfirmText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: { paddingBottom: 120 },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 12,
  },
  favoriteButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 12,
  },
  imageContainer: { height: 300 },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { flex: 1, fontSize: 26, fontWeight: '700', color: colors.textPrimary, marginRight: 12 },
  categoryBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  infoCards: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  infoCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  infoLabel: { fontSize: 12, color: colors.textMuted, marginTop: 8 },
  infoValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginTop: 4, textAlign: 'center' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 20,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  priceLabel: { fontSize: 14, color: colors.textSecondary },
  priceValue: { fontSize: 28, fontWeight: '700', color: colors.primary },
  reserveButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
  },
  reserveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16, marginRight: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.card, borderRadius: 24, padding: 30, width: '90%', alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginTop: 16 },
  modalSubtitle: { fontSize: 16, color: colors.textSecondary, marginVertical: 8 },
  modalPrice: { fontSize: 32, fontWeight: '700', color: colors.primary, marginVertical: 20 },
  modalButtons: { flexDirection: 'row', gap: 16, marginTop: 20 },
  modalCancel: { flex: 1, backgroundColor: colors.backgroundSecondary, padding: 16, borderRadius: 16 },
  modalCancelText: { textAlign: 'center', fontWeight: '600', color: colors.textSecondary },
  modalConfirm: { flex: 1, backgroundColor: colors.primary, padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  modalConfirmText: { color: '#fff', fontWeight: '700', marginRight: 8 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: colors.textSecondary },
  error: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: colors.error, marginTop: 20 },
});

export default DetailsReservationScreen;