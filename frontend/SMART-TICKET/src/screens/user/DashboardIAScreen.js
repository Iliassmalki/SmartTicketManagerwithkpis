import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors } from '../../theme/colors';

const DashboardIAScreen = () => {
  return (
    <ScreenWrapper>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard IA</Text>
          <Text style={styles.headerSubtitle}>Statistiques et recommandations personnalisées</Text>
        </View>

        {/* AI Card */}
        <View style={styles.aiCard}>
          <View style={styles.aiIconContainer}>
            <Ionicons name="sparkles" size={40} color={colors.primary} />
          </View>
          <Text style={styles.aiTitle}>Intelligence Artificielle</Text>
          <Text style={styles.aiDescription}>
            Nos algorithmes analysent vos préférences pour vous offrir les meilleures recommandations.
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderColor: colors.primary + '40' }]}>
            <Ionicons name="analytics-outline" size={28} color={colors.primary} />
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Analyses</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.secondary + '40' }]}>
            <Ionicons name="bulb-outline" size={28} color={colors.secondary} />
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Recommandations</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.accent + '40' }]}>
            <Ionicons name="heart-outline" size={28} color={colors.accent} />
            <Text style={styles.statNumber}>89%</Text>
            <Text style={styles.statLabel}>Précision</Text>
          </View>
          <View style={[styles.statCard, { borderColor: colors.success + '40' }]}>
            <Ionicons name="trending-up-outline" size={28} color={colors.success} />
            <Text style={styles.statNumber}>+24%</Text>
            <Text style={styles.statLabel}>Économies</Text>
          </View>
        </View>

        {/* Placeholder Section */}
        <View style={styles.placeholderSection}>
          <View style={styles.placeholderIcon}>
            <Ionicons name="construct-outline" size={48} color={colors.textMuted} />
          </View>
          <Text style={styles.placeholderTitle}>Fonctionnalité en développement</Text>
          <Text style={styles.placeholderText}>
            Le dashboard IA complet sera bientôt disponible avec des graphiques interactifs 
            et des insights personnalisés.
          </Text>
        </View>

        {/* Coming Soon Features */}
        <View style={styles.comingSoon}>
          <Text style={styles.sectionTitle}>Bientôt disponible</Text>
          <View style={styles.featureList}>
            {[
              { icon: 'pie-chart-outline', text: 'Analyse de vos préférences' },
              { icon: 'pulse-outline', text: 'Prédictions en temps réel' },
              { icon: 'gift-outline', text: 'Offres personnalisées' },
              { icon: 'calendar-outline', text: 'Planification intelligente' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name={feature.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.featureText}>{feature.text}</Text>
                <Ionicons name="time-outline" size={16} color={colors.textMuted} />
              </View>
            ))}
          </View>
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
  aiCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  aiIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  placeholderSection: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
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
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  comingSoon: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  featureList: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
});

export default DashboardIAScreen;





