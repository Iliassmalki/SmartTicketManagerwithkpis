# SMART-T 🎫

Application mobile de réservation intelligente avec React Native et Expo SDK 54.

## 🚀 Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Lancer l'application**
```bash
npx expo start
```

3. **Scanner le QR code** avec l'application Expo Go sur votre téléphone

## 📱 Fonctionnalités

### Mode Utilisateur
- **Accueil** : Parcourir les catégories (Matchs, Cinéma, Transport, Hôtels, Restaurants, Clubs)
- **Propositions** : Liste des événements disponibles
- **Détails & Réservation** : Voir les détails et réserver
- **Dashboard IA** : Statistiques et recommandations personnalisées
- **Historique** : Consulter les réservations passées
- **Notifications** : Alertes et mises à jour
- **Profil** : Gérer son compte
- **Configuration** : Paramètres (langue, thème, sécurité)

### Mode Organisateur
- **Dashboard** : Vue d'ensemble des performances
- **Mes Événements** : Gérer les événements créés
- **Créer Événement** : Formulaire de création
- **Revenus** : Suivi financier et historique des paiements
- **Détails Événement** : Voir les réservations par événement

## 🏗️ Architecture

```
src/
├── components/
│   ├── Placeholder.js
│   ├── ScreenWrapper.js
│   └── CategoryCard.js
├── navigation/
│   ├── UserStack.js
│   ├── OrganizerStack.js
│   └── RootNavigator.js
├── screens/
│   ├── user/
│   │   ├── AccueilUtilisateurScreen.js
│   │   ├── PropositionsScreen.js
│   │   ├── DetailsReservationScreen.js
│   │   ├── DashboardIAScreen.js
│   │   ├── HistoriqueScreen.js
│   │   ├── NotificationsScreen.js
│   │   ├── ProfilScreen.js
│   │   └── ConfigurationScreen.js
│   ├── organizer/
│   │   ├── DashboardOrganisateurScreen.js
│   │   ├── MesEvenementsScreen.js
│   │   ├── CreerEvenementScreen.js
│   │   ├── RevenusScreen.js
│   │   └── DetailsEvenementScreen.js
│   └── ModeSelectionScreen.js
└── theme/
    └── colors.js
```

## 🎨 Thème

L'application utilise un thème sombre moderne avec une palette de couleurs violet/cyan.

## 📦 Dépendances principales

- `expo` ~54.0.0
- `react-native` 0.76.9
- `@react-navigation/native` ^7.0.0
- `@react-navigation/native-stack` ^7.0.0
- `@react-navigation/bottom-tabs` ^7.0.0

## 📄 License

MIT

