import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors } from '../../theme/colors';

const notificationsData = [
  {
    id: '1',
    title: 'Réservation confirmée',
    message: 'Votre réservation pour le match PSG vs Lyon a été confirmée.',
    time: 'Il y a 2 heures',
    type: 'success',
    read: false,
  },
  {
    id: '2',
    title: 'Nouvelle offre disponible',
    message: 'Découvrez 20% de réduction sur les hôtels ce week-end !',
    time: 'Il y a 5 heures',
    type: 'promo',
    read: false,
  },
  {
    id: '3',
    title: 'Rappel événement',
    message: 'Votre événement commence demain à 20h00.',
    time: 'Hier',
    type: 'reminder',
    read: true,
  },
  {
    id: '4',
    title: 'Mise à jour disponible',
    message: 'Une nouvelle version de l\'application est disponible.',
    time: 'Il y a 2 jours',
    type: 'info',
    read: true,
  },
];

const getNotificationConfig = (type) => {
  switch (type) {
    case 'success':
      return { icon: 'checkmark-circle', color: colors.success };
    case 'promo':
      return { icon: 'gift', color: colors.accent };
    case 'reminder':
      return { icon: 'alarm', color: colors.warning };
    case 'info':
      return { icon: 'information-circle', color: colors.info };
    default:
      return { icon: 'notifications', color: colors.primary };
  }
};

const NotificationCard = ({ item }) => {
  const config = getNotificationConfig(item.type);
  
  return (
    <TouchableOpacity 
      style={[styles.card, !item.read && styles.cardUnread]} 
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
        <Ionicons name={config.icon} size={24} color={config.color} />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.cardMessage} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.cardTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const NotificationsScreen = () => {
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
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>Restez informé de vos activités</Text>
          </View>
          <TouchableOpacity style={styles.markAllButton}>
            <Ionicons name="checkmark-done-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonActive]}>
            <Text style={[styles.actionButtonText, styles.actionButtonTextActive]}>
              Toutes (4)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Non lues (2)</Text>
          </TouchableOpacity>
        </View>

        {/* Today Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aujourd'hui</Text>
          {notificationsData.slice(0, 2).map((item) => (
            <NotificationCard key={item.id} item={item} />
          ))}
        </View>

        {/* Earlier Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plus tôt</Text>
          {notificationsData.slice(2).map((item) => (
            <NotificationCard key={item.id} item={item} />
          ))}
        </View>

        {/* Empty/Placeholder */}
        <View style={styles.placeholder}>
          <View style={styles.placeholderIcon}>
            <Ionicons name="notifications-outline" size={48} color={colors.textMuted} />
          </View>
          <Text style={styles.placeholderText}>
            Vous êtes à jour ! Aucune autre notification.
          </Text>
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
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  markAllButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  actionButtonTextActive: {
    color: colors.textPrimary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardUnread: {
    backgroundColor: colors.primary + '08',
    borderColor: colors.primary + '30',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  cardMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  cardTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  placeholder: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default NotificationsScreen;





