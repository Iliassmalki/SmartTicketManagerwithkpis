import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors } from '../../theme/colors';

const TicketQRCodeScreen = ({ route, navigation }) => {
 const { ticket, hadi } = route.params;
console.log('hadi:', hadi); // should print 1

  console.log('hadi:', hadi);

  return (
    <ScreenWrapper>
      <View style={styles.container}>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Votre Billet 🎟️</Text>
        <Text style={styles.eventName}>{ticket.eventName}</Text>
        <Text style={styles.price}>{ticket.price} €</Text>

        {/* ✅ QR CODE DISPLAY */}
    <View style={styles.qrContainer}>
  <Image
    source={{ uri: hadi === 1 ? ticket.qrCode : ticket.qrCodeImage }}
    style={styles.qrImage}
  />
</View>


        <Text style={styles.info}>
          Présentez ce QR code à l’entrée de l’événement.
        </Text>

      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },

  eventName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },

  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 30,
  },

  qrContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    elevation: 6,
  },

  qrImage: {
    width: 220,
    height: 220,
  },

  info: {
    marginTop: 25,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default TicketQRCodeScreen;
