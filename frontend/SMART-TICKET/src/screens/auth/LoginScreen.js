// LoginScreen.tsx – VERSION DEBUG + SOLUTION FINALE
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ navigation, route }) => {
  const { loginUser, isLoading, user } = useAuth(); // <-- AJOUTÉ "user" pour debug
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  console.log('Current user in LoginScreen:', user); // DEBUG 1

  const returnTo = route.params?.returnTo;

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email invalide';
    if (!password) newErrors.password = 'Le mot de passe est requis';
    else if (password.length < 6) newErrors.password = 'Minimum 6 caractères';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleLogin = async () => {
  if (!validateForm()) return;

  const result = await loginUser(email.trim(), password);

  if (result.success) {
    console.log('Login réussi → retour au UserStack');
 await AsyncStorage.setItem('token', data.token);
 console.log('Token saved to AsyncStorage',data.token); // DEBUG 2
    // LA LIGNE MAGIQUE QUI MARCHE À 100%
    navigation.replace('UserStack');
  } else {
    Alert.alert('Erreur', result.message || 'Identifiants incorrects');
  }
 
};

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.replace('UserStack')}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="ticket" size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
              <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Pas de compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}> S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Styles inchangés...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, padding: 20, paddingTop: 60 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoIcon: {
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
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center' },
  form: { flex: 1 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: { borderColor: colors.error },
  input: { flex: 1, fontSize: 16, color: colors.textPrimary, marginLeft: 12 },
  errorText: { fontSize: 12, color: colors.error, marginTop: 6, marginLeft: 4 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: { opacity: 0.7 },
  loginButtonText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 14, color: colors.textMuted, marginHorizontal: 16 },
  socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 32 },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { fontSize: 15, color: colors.textSecondary },
  registerLink: { fontSize: 15, color: colors.primary, fontWeight: '600' },
});
export default LoginScreen;