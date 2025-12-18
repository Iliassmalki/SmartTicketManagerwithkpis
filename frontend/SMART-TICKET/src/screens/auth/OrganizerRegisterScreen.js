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

const OrganizerRegisterScreen = ({ navigation }) => {
  const { registerOrganizer, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    companyType: '',
    siret: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const companyTypes = [
    { id: 'association', label: 'Association', icon: 'people-outline' },
    { id: 'entreprise', label: 'Entreprise', icon: 'business-outline' },
    { id: 'independant', label: 'Indépendant', icon: 'person-outline' },
    { id: 'autre', label: 'Autre', icon: 'ellipsis-horizontal-outline' },
  ];

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) newErrors.companyName = 'Le nom est requis';
    if (!formData.companyType) newErrors.companyType = 'Sélectionnez un type';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'Vous devez accepter les conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleRegister = async () => {
    if (!validateStep3()) return;
    
    const result = await registerOrganizer(formData);
    
    if (result.success) {
      Alert.alert(
        'Compte créé !', 
        'Votre compte organisateur a été créé avec succès. Bienvenue sur SMART-T !',
        [
          {
            text: 'Commencer',
            onPress: () => navigation.replace('OrganizerStack'),
          },
        ]
      );
    } else {
      Alert.alert('Erreur', result.error || 'Une erreur est survenue');
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Informations personnelles</Text>
      <Text style={styles.stepSubtitle}>Commençons par vos informations de contact</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom complet <Text style={styles.required}>*</Text></Text>
        <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
          <Ionicons name="person-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Votre nom et prénom"
            placeholderTextColor={colors.textMuted}
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            autoCapitalize="words"
          />
        </View>
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
        <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
          <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="contact@email.com"
            placeholderTextColor={colors.textMuted}
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Téléphone <Text style={styles.required}>*</Text></Text>
        <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
          <Ionicons name="call-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="+33 6 00 00 00 00"
            placeholderTextColor={colors.textMuted}
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value)}
            keyboardType="phone-pad"
          />
        </View>
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>Votre organisation</Text>
      <Text style={styles.stepSubtitle}>Parlez-nous de votre structure</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom de l'organisation <Text style={styles.required}>*</Text></Text>
        <View style={[styles.inputWrapper, errors.companyName && styles.inputError]}>
          <Ionicons name="business-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Nom de votre entreprise/association"
            placeholderTextColor={colors.textMuted}
            value={formData.companyName}
            onChangeText={(value) => updateFormData('companyName', value)}
          />
        </View>
        {errors.companyName && <Text style={styles.errorText}>{errors.companyName}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Type d'organisation <Text style={styles.required}>*</Text></Text>
        <View style={styles.typeGrid}>
          {companyTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                formData.companyType === type.id && styles.typeCardSelected,
              ]}
              onPress={() => updateFormData('companyType', type.id)}
            >
              <Ionicons 
                name={type.icon} 
                size={24} 
                color={formData.companyType === type.id ? colors.secondary : colors.textMuted} 
              />
              <Text style={[
                styles.typeLabel,
                formData.companyType === type.id && styles.typeLabelSelected,
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.companyType && <Text style={styles.errorText}>{errors.companyType}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>SIRET (optionnel)</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="document-text-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="000 000 000 00000"
            placeholderTextColor={colors.textMuted}
            value={formData.siret}
            onChangeText={(value) => updateFormData('siret', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Adresse (optionnel)</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="location-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Adresse de l'organisation"
            placeholderTextColor={colors.textMuted}
            value={formData.address}
            onChangeText={(value) => updateFormData('address', value)}
          />
        </View>
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.stepTitle}>Sécurité du compte</Text>
      <Text style={styles.stepSubtitle}>Créez un mot de passe sécurisé</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mot de passe <Text style={styles.required}>*</Text></Text>
        <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            value={formData.password}
            onChangeText={(value) => updateFormData('password', value)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={colors.textMuted} 
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirmer le mot de passe <Text style={styles.required}>*</Text></Text>
        <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            value={formData.confirmPassword}
            onChangeText={(value) => updateFormData('confirmPassword', value)}
            secureTextEntry={!showPassword}
          />
        </View>
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      </View>

      {/* Password Requirements */}
      <View style={styles.requirements}>
        <View style={styles.requirementItem}>
          <Ionicons 
            name={formData.password.length >= 6 ? 'checkmark-circle' : 'ellipse-outline'} 
            size={16} 
            color={formData.password.length >= 6 ? colors.success : colors.textMuted} 
          />
          <Text style={[
            styles.requirementText,
            formData.password.length >= 6 && styles.requirementMet,
          ]}>
            Minimum 6 caractères
          </Text>
        </View>
        <View style={styles.requirementItem}>
          <Ionicons 
            name={formData.password === formData.confirmPassword && formData.password ? 'checkmark-circle' : 'ellipse-outline'} 
            size={16} 
            color={formData.password === formData.confirmPassword && formData.password ? colors.success : colors.textMuted} 
          />
          <Text style={[
            styles.requirementText,
            formData.password === formData.confirmPassword && formData.password && styles.requirementMet,
          ]}>
            Mots de passe identiques
          </Text>
        </View>
      </View>

      {/* Terms */}
      <TouchableOpacity 
        style={styles.termsContainer}
        onPress={() => setAcceptTerms(!acceptTerms)}
      >
        <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
          {acceptTerms && <Ionicons name="checkmark" size={14} color={colors.textPrimary} />}
        </View>
        <Text style={styles.termsText}>
          J'accepte les{' '}
          <Text style={styles.termsLink}>conditions d'utilisation</Text>
          {' '}et la{' '}
          <Text style={styles.termsLink}>politique de confidentialité</Text>
          {' '}pour les organisateurs
        </Text>
      </TouchableOpacity>
      {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
    </>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          
          {/* Progress */}
          <View style={styles.progressContainer}>
            {[1, 2, 3].map((s) => (
              <View 
                key={s} 
                style={[
                  styles.progressDot,
                  s <= step && styles.progressDotActive,
                  s < step && styles.progressDotComplete,
                ]}
              >
                {s < step ? (
                  <Ionicons name="checkmark" size={12} color={colors.textPrimary} />
                ) : (
                  <Text style={[styles.progressNumber, s <= step && styles.progressNumberActive]}>
                    {s}
                  </Text>
                )}
              </View>
            ))}
          </View>
          
          <View style={{ width: 44 }} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          {step < 3 ? (
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>Continuer</Text>
              <Ionicons name="arrow-forward" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color={colors.textPrimary} style={{ marginRight: 8 }} />
                  <Text style={styles.submitButtonText}>Créer mon compte</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  progressDotActive: {
    borderColor: colors.secondary,
  },
  progressDotComplete: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  progressNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  progressNumberActive: {
    color: colors.secondary,
  },
  form: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
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
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '47%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  typeCardSelected: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondary + '15',
  },
  typeLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  typeLabelSelected: {
    color: colors.secondary,
  },
  requirements: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    marginLeft: 10,
    fontSize: 14,
    color: colors.textMuted,
  },
  requirementMet: {
    color: colors.success,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.secondary,
    fontWeight: '500',
  },
  buttons: {
    paddingTop: 16,
  },
  nextButton: {
    backgroundColor: colors.secondary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  submitButton: {
    backgroundColor: colors.secondary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default OrganizerRegisterScreen;



