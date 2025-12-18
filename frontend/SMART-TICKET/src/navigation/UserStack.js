import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

// User Screens
import AccueilUtilisateurScreen from '../screens/user/AccueilUtilisateurScreen';
import PropositionsScreen from '../screens/user/PropositionsScreen';
import DetailsReservationScreen from '../screens/user/DetailsReservationScreen';
import DashboardIAScreen from '../screens/user/DashboardIAScreen';
import HistoriqueScreen from '../screens/user/HistoriqueScreen';
import NotificationsScreen from '../screens/user/NotificationsScreen';
import ProfilScreen from '../screens/user/ProfilScreen';
import ConfigurationScreen from '../screens/user/ConfigurationScreen';
import GeolocationScreen from '../screens/user/GeolocationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack with nested navigation
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AccueilUtilisateur" component={AccueilUtilisateurScreen} />
    <Stack.Screen name="Propositions" component={PropositionsScreen} />
    <Stack.Screen name="DetailsReservation" component={DetailsReservationScreen} />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfilMain" component={ProfilScreen} />
    <Stack.Screen name="Configuration" component={ConfigurationScreen} />
  </Stack.Navigator>
);

// Main User Tab Navigator
const UserTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: styles.tabBarLabel,
    }}
  >
    <Tab.Screen 
      name="Accueil" 
      component={HomeStack}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Carte" 
      component={GeolocationScreen}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'location' : 'location-outline'} size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="IA" 
      component={DashboardIAScreen}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'sparkles' : 'sparkles-outline'} size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Historique" 
      component={HistoriqueScreen}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'time' : 'time-outline'} size={size} color={color} />
        ),
      }}
    />
    
    <Tab.Screen 
      name="Profil" 
      component={ProfileStack}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 85,
    paddingTop: 10,
    paddingBottom: 25,
    paddingHorizontal: 10,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default UserTabNavigator;
