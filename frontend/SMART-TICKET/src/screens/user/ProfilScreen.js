// screens/ProfilScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { id: 'personal', icon: 'person-outline', title: 'Informations personnelles', color: colors.primary },
  { id: 'security', icon: 'shield-checkmark-outline', title: 'Sécurité', color: colors.secondary },
  { id: 'payment', icon: 'card-outline', title: 'Moyens de paiement', color: colors.accent },
  { id: 'preferences', icon: 'heart-outline', title: 'Préférences', color: colors.error },
  { id: 'language', icon: 'language-outline', title: 'Langue', color: colors.info },
  { id: 'help', icon: 'help-circle-outline', title: 'Aide & Support', color: colors.success },
];

const ProfilScreen = ({ navigation }) => {
  const { user: contextUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token manquant');

      const response = await fetch('http://192.168.1.104:3000/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Erreur serveur');
      }

      // result.user contient les vraies données
      setProfile(result.user);
    } catch (error) {
      console.error('Erreur fetch /users/me:', error);
      Alert.alert('Erreur', 'Impossible de charger le profil');
      // En cas d'erreur, on utilise quand même les données du contexte
      setProfile(contextUser);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Oui',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 16, color: colors.textSecondary }}>Chargement du profil...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Sécurité : si pas de user du tout
  if (!contextUser && !profile) {
    return (
      <ScreenWrapper>
        <View style={styles.notLoggedIn}>
          <Ionicons name="log-in-outline" size={80} color={colors.textMuted} />
          <Text style={styles.notLoggedInTitle}>Vous n'êtes pas connecté</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  // On priorise les données fraîches de /me, sinon fallback sur contexte
  const displayUser = profile || contextUser;

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Carte Profil */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {displayUser?.firstName?.[0]?.toUpperCase() || 'U'}
                {displayUser?.lastName?.[0]?.toUpperCase() || ''}
              </Text>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>
            {displayUser?.firstName} {displayUser?.lastName}
          </Text>
          <Text style={styles.userEmail}>{displayUser?.email}</Text>

          {displayUser?.location && (
            <View style={styles.locationBadge}>
              <Ionicons name="location-outline" size={14} color={colors.primary} />
              <Text style={styles.locationText}>{displayUser.location}</Text>
            </View>
          )}

          <View style={styles.memberBadge}>
            <Ionicons name="star" size={14} color={colors.accentLight} />
            <Text style={styles.memberText}>Membre Premium</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{displayUser?.nbticketssold || 0}</Text>
            <Text style={styles.statLabel}>Billets vendus</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Réservations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Paramètres du compte</Text>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Déconnexion */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  editButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primary + '20', justifyContent: 'center', alignItems: 'center' },
  profileCard: { alignItems: 'center', backgroundColor: colors.card, borderRadius: 20, padding: 28, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary + '30', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.primary },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: colors.primary },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.card },
  userName: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  userEmail: { fontSize: 15, color: colors.textSecondary, marginBottom: 12 },
  locationBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  locationText: { marginLeft: 6, color: colors.textSecondary, fontSize: 14 },
  memberBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accentLight + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  memberText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: colors.accentLight },
  statsContainer: { flexDirection: 'row', backgroundColor: colors.backgroundSecondary, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  statDivider: { width: 1, backgroundColor: colors.border },
  menuContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textMuted, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  menuIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuText: { flex: 1, fontSize: 16, color: colors.textPrimary, fontWeight: '500' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.error + '15', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.error + '30' },
  logoutText: { marginLeft: 10, fontSize: 16, fontWeight: '600', color: colors.error },
  versionText: { textAlign: 'center', marginTop: 24, fontSize: 12, color: colors.textMuted },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notLoggedIn: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  notLoggedInTitle: { fontSize: 20, fontWeight: '600', color: colors.textSecondary, marginVertical: 20 },
  loginButton: { backgroundColor: colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
  loginButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default ProfilScreen;