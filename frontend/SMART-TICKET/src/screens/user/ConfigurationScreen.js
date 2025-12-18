import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors } from '../../theme/colors';

const ConfigurationScreen = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const SettingToggle = ({ icon, title, subtitle, value, onValueChange, color = colors.primary }) => (
    <View style={styles.settingItem}>
      <View style={[styles.settingIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary + '60' }}
        thumbColor={value ? colors.primary : colors.textMuted}
      />
    </View>
  );

  const SettingButton = ({ icon, title, subtitle, value, color = colors.primary }) => (
    <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
      <View style={[styles.settingIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.settingValue}>
        {value && <Text style={styles.valueText}>{value}</Text>}
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Configuration</Text>
          <Text style={styles.headerSubtitle}>Personnalisez votre expérience</Text>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apparence</Text>
          <View style={styles.sectionCard}>
            <SettingToggle
              icon="moon-outline"
              title="Mode sombre"
              subtitle="Activer le thème sombre"
              value={darkMode}
              onValueChange={setDarkMode}
              color={colors.primary}
            />
            <View style={styles.divider} />
            <SettingButton
              icon="color-palette-outline"
              title="Thème"
              value="Violet"
              color={colors.accent}
            />
            <View style={styles.divider} />
            <SettingButton
              icon="text-outline"
              title="Taille du texte"
              value="Moyen"
              color={colors.info}
            />
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Langue & Région</Text>
          <View style={styles.sectionCard}>
            <SettingButton
              icon="language-outline"
              title="Langue"
              value="Français"
              color={colors.secondary}
            />
            <View style={styles.divider} />
            <SettingButton
              icon="globe-outline"
              title="Région"
              value="France"
              color={colors.success}
            />
            <View style={styles.divider} />
            <SettingButton
              icon="cash-outline"
              title="Devise"
              value="EUR (€)"
              color={colors.accentLight}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionCard}>
            <SettingToggle
              icon="notifications-outline"
              title="Notifications push"
              subtitle="Recevoir les alertes"
              value={notifications}
              onValueChange={setNotifications}
              color={colors.warning}
            />
            <View style={styles.divider} />
            <SettingButton
              icon="mail-outline"
              title="Notifications email"
              value="Activé"
              color={colors.info}
            />
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sécurité</Text>
          <View style={styles.sectionCard}>
            <SettingToggle
              icon="finger-print-outline"
              title="Biométrie"
              subtitle="Connexion par empreinte/Face ID"
              value={biometric}
              onValueChange={setBiometric}
              color={colors.error}
            />
            <View style={styles.divider} />
            <SettingButton
              icon="lock-closed-outline"
              title="Changer le mot de passe"
              color={colors.accent}
            />
            <View style={styles.divider} />
            <SettingToggle
              icon="location-outline"
              title="Services de localisation"
              subtitle="Permettre l'accès à la position"
              value={locationServices}
              onValueChange={setLocationServices}
              color={colors.secondary}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.sectionCard}>
            <SettingButton
              icon="document-text-outline"
              title="Conditions d'utilisation"
              color={colors.textMuted}
            />
            <View style={styles.divider} />
            <SettingButton
              icon="shield-outline"
              title="Politique de confidentialité"
              color={colors.textMuted}
            />
            <View style={styles.divider} />
            <SettingButton
              icon="information-circle-outline"
              title="Version"
              value="1.0.0"
              color={colors.textMuted}
            />
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton}>
          <Ionicons name="refresh-outline" size={20} color={colors.warning} />
          <Text style={styles.resetText}>Réinitialiser les paramètres</Text>
        </TouchableOpacity>
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
    marginBottom: 28,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 72,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warning + '15',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.warning + '30',
    marginTop: 8,
  },
  resetText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: colors.warning,
  },
});

export default ConfigurationScreen;





