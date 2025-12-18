import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors } from '../../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native';
const API_URL = 'http://192.168.1.104:3000/tickets/getbyuser';

const getStatusConfig = (used) => {
  return used
    ? { label: 'Utilisé', color: colors.success, icon: 'checkmark-circle' }
    : { label: 'Valide', color: colors.warning, icon: 'time' };
};

const getTypeIcon = () => 'calendar-outline';

const ReservationCard = ({ item, onPress }) => { // <- ajouter onPress
  const statusConfig = getStatusConfig(item.used);
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7} 
      onPress={onPress} // <- utiliser onPress ici
    >
      <View style={styles.cardLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={getTypeIcon()} size={24} color={colors.primary} />
        </View>
      </View>

      <View style={styles.cardCenter}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.event.name}</Text>

        <View style={styles.cardInfo}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={styles.cardDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
          <Ionicons name={statusConfig.icon} size={12} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.price}>{item.price} €</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};


const HistoriqueScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
useEffect(() => {
  const fetchTickets = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        console.log("❌ No token found");
        return;
      }

      const res = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await res.json();
      console.log("✅ Tickets from API:", data);

      setTickets(data);
    } catch (err) {
      console.log("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchTickets();
}, []);


  const totalSpent = tickets.reduce((sum, t) => sum + t.price, 0);
  const completedRate = tickets.length
    ? Math.round((tickets.filter(t => t.used).length / tickets.length) * 100)
    : 0;

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Historique</Text>
          <Text style={styles.headerSubtitle}>Vos tickets achetés</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{tickets.length}</Text>
            <Text style={styles.statLabel}>Tickets</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalSpent} €</Text>
            <Text style={styles.statLabel}>Total dépensé</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedRate}%</Text>
            <Text style={styles.statLabel}>Utilisés</Text>
          </View>
        </View>

        {/* List */}
        <View style={styles.listContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vos tickets</Text>
          </View>

          {loading && <ActivityIndicator size="large" color={colors.primary} />}

          {!loading && tickets.length === 0 && (
            <View style={styles.emptyPlaceholder}>
              <Ionicons name="document-text-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>Aucun ticket trouvé</Text>
            </View>
          )}

          {tickets.map((item) => (
            <ReservationCard key={item.id} item={item} onPress={() => navigation.navigate('TicketQRCode', { ticket: item,hadi:1 })} />
          ))}
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
  
};
const styles = StyleSheet.create({ container: { flex: 1, }, contentContainer: { padding: 20, paddingBottom: 100, }, header: { marginBottom: 24, }, headerTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 4, }, headerSubtitle: { fontSize: 14, color: colors.textSecondary, }, filterTabs: { flexDirection: 'row', backgroundColor: colors.backgroundSecondary, borderRadius: 12, padding: 4, marginBottom: 20, }, filterTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, }, filterTabActive: { backgroundColor: colors.primary, }, filterTabText: { fontSize: 14, fontWeight: '500', color: colors.textMuted, }, filterTabTextActive: { color: colors.textPrimary, }, statsRow: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: colors.border, }, statItem: { flex: 1, alignItems: 'center', }, statValue: { fontSize: 22, fontWeight: '700', color: colors.primary, marginBottom: 4, }, statLabel: { fontSize: 12, color: colors.textSecondary, }, statDivider: { width: 1, backgroundColor: colors.border, marginVertical: 4, }, listContainer: { marginBottom: 20, }, sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, }, sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary, }, seeAll: { fontSize: 14, color: colors.primary, fontWeight: '500', }, card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border, }, cardLeft: { marginRight: 14, }, iconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.primary + '20', justifyContent: 'center', alignItems: 'center', }, cardCenter: { flex: 1, }, cardTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 4, }, cardInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, }, cardDate: { marginLeft: 6, fontSize: 13, color: colors.textMuted, }, statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, }, statusText: { marginLeft: 4, fontSize: 11, fontWeight: '600', }, cardRight: { alignItems: 'flex-end', }, price: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 8, }, emptyPlaceholder: { alignItems: 'center', padding: 32, backgroundColor: colors.backgroundSecondary, borderRadius: 16, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', }, emptyText: { marginTop: 12, fontSize: 14, color: colors.textMuted, }, });

export default HistoriqueScreen;
