import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const ModeSelectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        {[...Array(20)].map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.patternDot,
              { 
                top: Math.random() * 800,
                left: Math.random() * width,
                opacity: Math.random() * 0.3 + 0.1,
              }
            ]} 
          />
        ))}
      </View>

      {/* Logo & Title */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="ticket" size={48} color={colors.primary} />
        </View>
        <Text style={styles.title}>SMART-T</Text>
        <Text style={styles.subtitle}>Votre plateforme de réservation intelligente</Text>
      </View>

      {/* Mode Selection */}
      <View style={styles.cardsContainer}>
        <Text style={styles.selectText}>Choisissez votre mode</Text>

        {/* User Mode Card */}
        <TouchableOpacity 
          style={styles.modeCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('UserStack')}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="person" size={36} color={colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Mode Utilisateur</Text>
            <Text style={styles.cardDescription}>
              Découvrez et réservez des événements, matchs, spectacles et plus encore
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward" size={24} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Organizer Mode Card */}
        <TouchableOpacity 
          style={styles.modeCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('OrganizerStack')}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
            <Ionicons name="business" size={36} color={colors.secondary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Mode Organisateur</Text>
            <Text style={styles.cardDescription}>
              Créez et gérez vos événements, suivez vos ventes et revenus
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward" size={24} color={colors.secondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={20} color={colors.success} />
            <Text style={styles.featureText}>Sécurisé</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <Ionicons name="flash" size={20} color={colors.warning} />
            <Text style={styles.featureText}>Rapide</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.featureItem}>
            <Ionicons name="sparkles" size={20} color={colors.accent} />
            <Text style={styles.featureText}>IA Intégrée</Text>
          </View>
        </View>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  patternDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.primary + '40',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  selectText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  arrowContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  featureDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
  },
});

export default ModeSelectionScreen;

