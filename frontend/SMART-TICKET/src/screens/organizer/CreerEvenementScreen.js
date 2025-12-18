// screens/CreerEvenementScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors } from '../../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreerEvenementScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    startDate: new Date(),
    latitude: '',
    longitude: '',
  });
  const [showMap, setShowMap] = useState(false);
  const [tempMarker, setTempMarker] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Chargement de la position actuelle au démarrage
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setMapRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        // Fallback Casablanca
        setMapRegion({
          latitude: 33.5731,
          longitude: -7.5898,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    })();
  }, []);

  const handleMapLongPress = (e) => {
    const { coordinate } = e.nativeEvent;
    setTempMarker(coordinate);
  };

  const confirmLocation = () => {
    if (tempMarker) {
      setFormData(prev => ({
        ...prev,
        latitude: tempMarker.latitude.toFixed(6),
        longitude: tempMarker.longitude.toFixed(6),
      }));
      setShowMap(false);
      setTempMarker(null);
    }
  };

  const handleSubmit = async () => {
    // Validation simple
    if (!formData.name || !formData.price || !formData.latitude || !formData.longitude) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erreur', 'Vous devez être connecté');
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description || 'Pas de description',
        price: formData.price,
        startDate: formData.startDate.toISOString().split('T')[0],
        lat: formData.latitude,
        long: formData.longitude,
      };

      const response = await fetch('http://192.168.1.104:3000/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Erreur création');

      Alert.alert('Succès', 'Événement créé !', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Impossible de créer l\'événement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Créer un événement</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              placeholder="Concert Jazz Casablanca"
              value={formData.name}
              onChangeText={(v) => setFormData(prev => ({ ...prev, name: v }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Une soirée inoubliable..."
              multiline
              value={formData.description}
              onChangeText={(v) => setFormData(prev => ({ ...prev, description: v }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prix (€)</Text>
            <TextInput
              style={styles.input}
              placeholder="25.00"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(v) => setFormData(prev => ({ ...prev, price: v }))}
            />
          </View>

          {/* Date Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: colors.textPrimary }}>
                {formData.startDate.toLocaleDateString('fr-FR')}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.startDate}
                mode="date"
                minimumDate={new Date()}
                onChange={(e, date) => {
                  setShowDatePicker(false);
                  if (date) setFormData(prev => ({ ...prev, startDate: date }));
                }}
              />
            )}
          </View>

          {/* Location Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lieu (cliquez sur la carte)</Text>
            <TouchableOpacity style={styles.mapButton} onPress={() => setShowMap(true)}>
              <Ionicons name="map-outline" size={20} color={colors.primary} />
              <Text style={styles.mapButtonText}>
                {formData.latitude ? `Lat: ${formData.latitude}, Lng: ${formData.longitude}` : 'Choisir sur la carte'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[styles.publishButton, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.publishButtonText}>Publier l'événement</Text>
                <Ionicons name="paper-plane-outline" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Map Modal */}
      <Modal visible={showMap} animationType="slide">
        <View style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <TouchableOpacity onPress={() => setShowMap(false)}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Choisir le lieu</Text>
            <TouchableOpacity onPress={confirmLocation} style={styles.confirmButton}>
              <Text style={styles.confirmText}>Confirmer</Text>
            </TouchableOpacity>
          </View>

          {mapRegion ? (
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={mapRegion}
              onLongPress={handleMapLongPress}
            >
              {tempMarker && (
                <Marker coordinate={tempMarker} title="Lieu choisi" />
              )}
            </MapView>
          ) : (
            <ActivityIndicator size="large" color={colors.primary} />
          )}
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: { paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  backButton: { padding: 10, backgroundColor: colors.backgroundSecondary, borderRadius: 12 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  form: { paddingHorizontal: 20 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  input: { backgroundColor: colors.borderLight, padding: 16, borderRadius: 12, fontSize: 16 },
  textArea: { height: 120, textAlignVertical: 'top' },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  mapButtonText: { marginLeft: 12, color: colors.primary, fontWeight: '600' },
  bottomActions: { padding: 20 },
  publishButton: { backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 18, borderRadius: 16 },
  publishButtonText: { color: '#fff', fontWeight: '700', fontSize: 16, marginRight: 10 },
  mapContainer: { flex: 1 },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: colors.backgroundSecondary },
  mapTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  confirmButton: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  confirmText: { color: '#fff', fontWeight: '600' },
  map: { flex: 1 },
});

export default CreerEvenementScreen;