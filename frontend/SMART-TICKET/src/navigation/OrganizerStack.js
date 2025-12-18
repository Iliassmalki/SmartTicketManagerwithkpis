import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import AnalyticsStack from '../screens/organizer/analytics';
// Organizer Screens
import DashboardOrganisateurScreen from '../screens/organizer/DashboardOrganisateurScreen';
import MesEvenementsScreen from '../screens/organizer/MesEvenementsScreen';
import CreerEvenementScreen from '../screens/organizer/CreerEvenementScreen';
import RevenusScreen from '../screens/organizer/RevenusScreen';
import DetailsEvenementScreen from '../screens/organizer/DetailsEvenementScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Dashboard Stack
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardMain" component={DashboardOrganisateurScreen} />
  </Stack.Navigator>
);

// Events Stack with nested navigation
const EventsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MesEvenementsMain" component={MesEvenementsScreen} />
    <Stack.Screen name="CreerEvenement" component={CreerEvenementScreen} />
    <Stack.Screen name="DetailsEvenement" component={DetailsEvenementScreen} />
  </Stack.Navigator>
);

// Main Organizer Tab Navigator
const OrganizerTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.secondary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: styles.tabBarLabel,
    }}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardStack}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'grid' : 'grid-outline'} size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Événements" 
      component={EventsStack}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Créer" 
      component={CreerEvenementScreen}
      options={{
        tabBarIcon: () => (
          <View style={styles.createButton}>
            <Ionicons name="add" size={28} color={colors.textPrimary} />
          </View>
        ),
        tabBarLabel: () => null,
      }}
    />
     <Stack.Screen 
          name="AnalyticsStack" 
          component={AnalyticsStack}
          options={{
            animation: 'fade',
          }}
        />
    <Tab.Screen 
      name="Revenus" 
      component={RevenusScreen}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Plus" 
      component={RevenusScreen}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'} size={size} color={color} />
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
  createButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default OrganizerTabNavigator;
