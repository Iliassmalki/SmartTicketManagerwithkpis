import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import ScreenWrapper from '../../components/ScreenWrapper';
import { colors } from '../../theme/colors';

const CARD_HEIGHT = 220; // Adjust as needed

const AnalyticsScreen = () => {
  // Replace these URLs with your ngrok URLs in production
  const cards = [
    {
      title: 'Événements par localisation',
      url: 'https://neida-recollective-kathryne.ngrok-free.dev/public/question/e9150fb3-56cc-45a2-93ed-31cb62cc992d?ngrok-skip-browser-warning=true#bordered=false&titled=false',
    },
    {
      title: 'Achats par jour',
      url: 'https://neida-recollective-kathryne.ngrok-free.dev/public/question/a6c06fc3-4041-42c0-9171-53d8283caacc?ngrok-skip-browser-warning=true#bordered=false&titled=false',
    },
    {
      title: 'Revenus par catégorie',
      url: 'https://neida-recollective-kathryne.ngrok-free.dev/public/question/6d147d91-0345-41bc-9a73-36124ca44177?ngrok-skip-browser-warning=true#bordered=false&titled=false',
    },
  ];

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headerTitle}>Analytics</Text>

        {cards.map((card, index) => (
          <View key={index} style={styles.cardContainer}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <View style={styles.webviewWrapper}>
              <WebView
                source={{ uri: card.url }}
                originWhitelist={['*']}
                javaScriptEnabled
                domStorageEnabled
                scrollEnabled={false}
                style={styles.webview}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  cardContainer: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: colors.card,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    padding: 12,
    backgroundColor: colors.backgroundSecondary,
  },
  webviewWrapper: {
    height: CARD_HEIGHT,
    width: Dimensions.get('window').width - 32,
    backgroundColor: colors.card,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default AnalyticsScreen;
