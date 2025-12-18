import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors } from '../../theme/colors';

const transactionsData = [
  { id: '1', title: 'Concert Jazz Night', amount: '+1,250 €', date: '15 Jan 2025', type: 'income' },
  { id: '2', title: 'Match de Football', amount: '+850 €', date: '14 Jan 2025', type: 'income' },
  { id: '3', title: 'Retrait vers banque', amount: '-2,000 €', date: '12 Jan 2025', type: 'withdrawal' },
  { id: '4', title: 'Spectacle Comédie', amount: '+620 €', date: '10 Jan 2025', type: 'income' },
  { id: '5', title: 'Frais de service', amount: '-45 €', date: '8 Jan 2025', type: 'fee' },
];

const RevenusScreen = () => {
  return (
    <ScreenWrapper>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Revenus</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Solde disponible</Text>
            <TouchableOpacity style={styles.eyeButton}>
              <Ionicons name="eye-outline" size={20} color={colors.textPrimary + '80'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceValue}>8,675 €</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.withdrawButton}>
              <Ionicons name="arrow-up-outline" size={20} color={colors.textPrimary} />
              <Text style={styles.withdrawText}>Retirer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.historyButton}>
              <Ionicons name="document-text-outline" size={20} color={colors.primary} />
              <Text style={styles.historyText}>Relevé</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
              <Ionicons name="trending-up" size={20} color={colors.success} />
            </View>
            <Text style={styles.statValue}>12,540 €</Text>
            <Text style={styles.statLabel}>Ce mois</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>45,230 €</Text>
            <Text style={styles.statLabel}>Cette année</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.accent + '20' }]}>
              <Ionicons name="swap-horizontal" size={20} color={colors.accent} />
            </View>
            <Text style={styles.statValue}>324</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Évolution des revenus</Text>
            <View style={styles.chartTabs}>
              <TouchableOpacity style={[styles.chartTab, styles.chartTabActive]}>
                <Text style={[styles.chartTabText, styles.chartTabTextActive]}>7J</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chartTab}>
                <Text style={styles.chartTabText}>1M</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chartTab}>
                <Text style={styles.chartTabText}>1A</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="analytics-outline" size={48} color={colors.textMuted} />
            <Text style={styles.chartPlaceholderText}>Graphique des revenus</Text>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Historique des paiements</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsList}>
            {transactionsData.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={[
                  styles.transactionIcon, 
                  { backgroundColor: transaction.type === 'income' ? colors.success + '20' : 
                                     transaction.type === 'withdrawal' ? colors.warning + '20' : 
                                     colors.error + '20' }
                ]}>
                  <Ionicons 
                    name={transaction.type === 'income' ? 'arrow-down' : 
                          transaction.type === 'withdrawal' ? 'arrow-up' : 'remove'} 
                    size={18} 
                    color={transaction.type === 'income' ? colors.success : 
                           transaction.type === 'withdrawal' ? colors.warning : 
                           colors.error}
                  />
                </View>
                <View style={styles.transactionContent}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'income' ? colors.success : colors.error }
                ]}>
                  {transaction.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Placeholder */}
        <View style={styles.placeholder}>
          <Ionicons name="wallet-outline" size={40} color={colors.textMuted} />
          <Text style={styles.placeholderTitle}>Revenus + historique des paiements</Text>
          <Text style={styles.placeholderText}>Fonctionnalités complètes à venir</Text>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textPrimary + 'CC',
  },
  eyeButton: {
    padding: 4,
  },
  balanceValue: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 24,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  withdrawButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.textPrimary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  withdrawText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  historyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight + '30',
    paddingVertical: 14,
    borderRadius: 12,
  },
  historyText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chartTabs: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    padding: 3,
  },
  chartTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  chartTabActive: {
    backgroundColor: colors.primary,
  },
  chartTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  chartTabTextActive: {
    color: colors.textPrimary,
  },
  chartPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
  },
  chartPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textMuted,
  },
  section: {
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
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  transactionsList: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 13,
    color: colors.textMuted,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  placeholder: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
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
});

export default RevenusScreen;





