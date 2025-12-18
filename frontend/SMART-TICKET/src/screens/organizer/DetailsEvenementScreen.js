import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors } from '../../theme/colors';

const reservationsData = [
  { id: '1', name: 'Jean Dupont', quantity: 2, date: '15 Jan 2025', status: 'confirmed' },
  { id: '2', name: 'Marie Martin', quantity: 4, date: '14 Jan 2025', status: 'confirmed' },
  { id: '3', name: 'Pierre Bernard', quantity: 1, date: '14 Jan 2025', status: 'pending' },
  { id: '4', name: 'Sophie Petit', quantity: 3, date: '13 Jan 2025', status: 'confirmed' },
];

const DetailsEvenementScreen = ({ route, navigation }) => {
  const event = route.params?.event || {
    title: 'Événement',
    date: '20 Janvier 2025',
    location: 'Paris',
    sold: 450,
    total: 500,
    revenue: '6,750 €',
  };

  const fillPercentage = (event.sold / event.total) * 100;

  return (
    <ScreenWrapper>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détails</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Event Image Placeholder */}
        <View style={styles.imageContainer}>
          <Ionicons name="image-outline" size={60} color={colors.textMuted} />
        </View>

        {/* Event Info */}
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>{event.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>{event.location}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderColor: colors.primary + '40' }]}>
            <Ionicons name="ticket-outline" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{event.sold}</Text>
            <Text style={styles.statLabel}>Vendus</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.secondary + '40' }]}>
            <Ionicons name="people-outline" size={24} color={colors.secondary} />
            <Text style={styles.statValue}>{event.total}</Text>
            <Text style={styles.statLabel}>Capacité</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.success + '40' }]}>
            <Ionicons name="cash-outline" size={24} color={colors.success} />
            <Text style={styles.statValue}>{event.revenue}</Text>
            <Text style={styles.statLabel}>Revenus</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Taux de remplissage</Text>
            <Text style={styles.progressPercent}>{Math.round(fillPercentage)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${fillPercentage}%` }]} />
          </View>
          <Text style={styles.progressHint}>
            {event.total - event.sold} places restantes
          </Text>
        </View>

        {/* Reservations List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Liste des réservations</Text>
            <TouchableOpacity style={styles.exportButton}>
              <Ionicons name="download-outline" size={18} color={colors.primary} />
              <Text style={styles.exportText}>Exporter</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reservationsList}>
            {reservationsData.map((reservation) => (
              <View key={reservation.id} style={styles.reservationItem}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {reservation.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.reservationContent}>
                  <Text style={styles.reservationName}>{reservation.name}</Text>
                  <Text style={styles.reservationDetail}>
                    {reservation.quantity} place(s) • {reservation.date}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: reservation.status === 'confirmed' ? colors.success + '20' : colors.warning + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: reservation.status === 'confirmed' ? colors.success : colors.warning }
                  ]}>
                    {reservation.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Placeholder */}
        <View style={styles.placeholder}>
          <Ionicons name="document-text-outline" size={40} color={colors.textMuted} />
          <Text style={styles.placeholderTitle}>Détails de l'événement</Text>
          <Text style={styles.placeholderText}>+ liste de réservations</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionSecondary}>
            <Ionicons name="pause-circle-outline" size={20} color={colors.warning} />
            <Text style={styles.actionSecondaryText}>Suspendre</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionPrimary}>
            <Ionicons name="share-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.actionPrimaryText}>Partager</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 200,
    marginHorizontal: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  eventInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressCard: {
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  progressHint: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
  },
  reservationsList: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  reservationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  reservationContent: {
    flex: 1,
  },
  reservationName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  reservationDetail: {
    fontSize: 13,
    color: colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  placeholder: {
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 24,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  placeholderTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  placeholderText: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warning + '15',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  actionSecondaryText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: colors.warning,
  },
  actionPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionPrimaryText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default DetailsEvenementScreen;





