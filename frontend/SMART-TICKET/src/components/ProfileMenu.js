import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

const ProfileMenu = () => {
  const navigation = useNavigation();
  const { user, isUserLoggedIn, logoutUser } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleOrganizerMode = () => {
    setMenuVisible(false);
    navigation.navigate('OrganizerLogin');
  };

  const handleProfile = () => {
    setMenuVisible(false);
    navigation.navigate('Profil');
  };

  const handleLogin = () => {
    setMenuVisible(false);
    navigation.navigate('Login');
  };

  const handleLogout = () => {
    setMenuVisible(false);
    logoutUser();
  };

  return (
    <>
      {/* Profile Icon Button */}
      <TouchableOpacity 
        style={styles.avatarContainer}
        onPress={() => setMenuVisible(true)}
      >
        {isUserLoggedIn ? (
          <View style={styles.avatarInitials}>
            <Text style={styles.initialsText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
        ) : (
          <Ionicons name="person-circle-outline" size={44} color={colors.primary} />
        )}
      </TouchableOpacity>

      {/* Dropdown Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            {/* User Info */}
            {isUserLoggedIn ? (
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
                  <Text style={styles.userEmail}>{user?.email}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.userInfo}>
                <View style={[styles.userAvatar, { backgroundColor: colors.textMuted + '30' }]}>
                  <Ionicons name="person-outline" size={24} color={colors.textMuted} />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>Visiteur</Text>
                  <Text style={styles.userEmail}>Non connecté</Text>
                </View>
              </View>
            )}

            <View style={styles.divider} />

            {/* Menu Items */}
            {isUserLoggedIn ? (
              <>
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleProfile}
                >
                  <Ionicons name="person-outline" size={22} color={colors.textPrimary} />
                  <Text style={styles.menuItemText}>Mon profil</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleLogin}
              >
                <Ionicons name="log-in-outline" size={22} color={colors.primary} />
                <Text style={[styles.menuItemText, { color: colors.primary }]}>Se connecter</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.primary} />
              </TouchableOpacity>
            )}

            <View style={styles.divider} />

            {/* Organizer Mode */}
            <TouchableOpacity 
              style={styles.organizerItem}
              onPress={handleOrganizerMode}
            >
              <View style={styles.organizerIcon}>
                <Ionicons name="business" size={22} color={colors.secondary} />
              </View>
              <View style={styles.organizerContent}>
                <Text style={styles.organizerTitle}>Mode Organisateur</Text>
                <Text style={styles.organizerSubtitle}>Créez et gérez vos événements</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color={colors.secondary} />
            </TouchableOpacity>

            {isUserLoggedIn && (
              <>
                <View style={styles.divider} />
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={22} color={colors.error} />
                  <Text style={[styles.menuItemText, { color: colors.error }]}>Déconnexion</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '40',
  },
  avatarInitials: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  menuContainer: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-end',
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
    marginVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginLeft: 14,
  },
  organizerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: colors.secondary + '10',
    borderRadius: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.secondary + '30',
  },
  organizerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizerContent: {
    flex: 1,
    marginLeft: 12,
  },
  organizerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 2,
  },
  organizerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default ProfileMenu;



