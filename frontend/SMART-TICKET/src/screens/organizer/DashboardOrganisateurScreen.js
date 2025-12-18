// screens/organizer/DashboardOrganisateurScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../theme/colors';
import { WebView } from 'react-native-webview';

const DashboardOrganisateurScreen = ({ navigation }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
const [myEventsCount, setMyEventsCount] = useState(0);
  useEffect(() => {
    fetchDashboardData();
  }, []);

const fetchDashboardData = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      Alert.alert('Erreur', 'Token manquant');
      navigation.navigate('Login');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // ✅ Fetch both endpoints at the same time
    const [userRes, eventsRes] = await Promise.all([
      fetch('http://192.168.1.104:3000/users/me', { headers }),
      fetch('http://192.168.1.104:3000/events/my', { headers }),
    ]);

    const userResult = await userRes.json();
    const eventsResult = await eventsRes.json();

    if (!userResult.success) {
      throw new Error(userResult.message || 'Erreur utilisateur');
    }

    if (!eventsRes.ok) {
      throw new Error('Erreur chargement événements');
    }

    // ✅ Count events length (depends on your API response shape)
    const eventsCount = Array.isArray(eventsResult)
      ? eventsResult.length
      : Array.isArray(eventsResult.events)
      ? eventsResult.events.length
      : 0;

    setDashboardData(userResult.user);
    setMyEventsCount(eventsCount);

  } catch (error) {
    console.error('Erreur fetch dashboard:', error);
    Alert.alert('Erreur', 'Impossible de charger le tableau de bord');
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement du dashboard...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!dashboardData) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={colors.error} />
          <Text style={styles.errorText}>Données indisponibles</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const statsData = [
    { label: 'Revenus totaux', value: `${dashboardData.revenue || '0.00'} €`, icon: 'cash-outline', color: colors.success },
    { label: 'Billets vendus', value: dashboardData.nbticketssold || 0, icon: 'ticket-outline', color: colors.primary },
    { label: 'Événements créés', value: myEventsCount, icon: 'calendar-outline', color: colors.accent },
    { label: 'Taux de remplissage', value: '78%', icon: 'pie-chart-outline', color: colors.secondary },
  ];

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Bonjour, {dashboardData.firstName} {dashboardData.lastName} 
            </Text>
            <Text style={styles.headerTitle}>Dashboard Organisateur</Text>
          </View>
          <TouchableOpacity style={styles.notifButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

       <View style={styles.revenueCard}>
  <View style={styles.revenueHeader}>
    <Text style={styles.revenueLabel}>Revenus par catégories</Text>
    <View style={styles.revenueBadge}>
      <Ionicons name="trending-up" size={14} color={colors.success} />
      <Text style={styles.revenueChange}>+23%</Text>
    </View>
  </View>

  <Text style={styles.revenueValue}>
    {dashboardData.revenue || '0.00'} €
  </Text>

  {/* Metabase Chart */}
  <View style={styles.metabaseChartContainer}>
 <WebView
  source={{
    uri: 'https://neida-recollective-kathryne.ngrok-free.dev/public/question/82aa2bf3-770c-47b7-a51f-377d5f081f89?ngrok-skip-browser-warning=true#bordered=false&titled=false'
  }}
  originWhitelist={['*']}
  javaScriptEnabled
  
  domStorageEnabled
  scrollEnabled={true}
  startInLoadingState
/>
  </View>
</View>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <View key={index} style={[styles.statCard, { borderColor: stat.color + '40' }]}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={22} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('CreerEvenement')}>
              <Ionicons name="add-circle" size={28} color={colors.primary} />
              <Text style={styles.actionText}>Créer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('MesEvenements')}>
              <Ionicons name="calendar" size={28} color={colors.secondary} />
              <Text style={styles.actionText}>Événements</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Revenus')}>
              <Ionicons name="wallet" size={28} color={colors.accent} />
              <Text style={styles.actionText}>Revenus</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AnalyticsStack')} >
              <Ionicons name="stats-chart" size={28} color={colors.success} />
              <Text style={styles.actionText}>analytics </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activité récente</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            <Text style={{ padding: 20, color: colors.textMuted, textAlign: 'center' }}>
              Aucune activité récente
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  notifButton: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.backgroundSecondary, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  notifBadge: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
  revenueCard: { backgroundColor: colors.primary, borderRadius: 20, padding: 24, marginBottom: 20 },
  revenueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  revenueLabel: { fontSize: 14, color: colors.textPrimary + 'CC' },
  revenueBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.success + '30', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  revenueChange: { marginLeft: 4, fontSize: 12, fontWeight: '600', color: colors.success },
  revenueValue: { fontSize: 36, fontWeight: '700', color: colors.textPrimary, marginBottom: 20 },
  revenueChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, marginBottom: 8 },
  chartBar: { width: 32, backgroundColor: colors.textPrimary, borderRadius: 6 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  chartLabel: { fontSize: 11, color: colors.textPrimary + '80', width: 32, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1 },
  statIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  statLabel: { fontSize: 13, color: colors.textSecondary },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  seeAll: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, padding: 16, width: '23%', borderWidth: 1, borderColor: colors.border },
  actionText: { marginTop: 8, fontSize: 11, color: colors.textSecondary, fontWeight: '500' },
  activityList: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: colors.textSecondary },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: colors.error, marginTop: 20 },
  metabaseChartContainer: {
  height: 180,
  overflow: 'hidden',
  borderRadius: 12,
},

metabaseWebview: {
  flex: 1,
  backgroundColor: 'transparent',
},

});

export default DashboardOrganisateurScreen;