import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TicketQRCodeScreen from '../screens/user/TicketQRCodeScreen';
import { colors } from '../theme/colors';

// Auth Screens
import { 
  LoginScreen, 

  RegisterScreen, 
  OrganizerLoginScreen, 
  OrganizerRegisterScreen 
} from '../screens/auth';

// Stack Navigators
import UserStack from './UserStack';
import OrganizerStack from './OrganizerStack';
import analyticsStack from '../screens/organizer/analytics';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.textPrimary,
          border: colors.border,
          notification: colors.accent,
        },
      }}
    >
      <Stack.Navigator 
        initialRouteName="UserStack"
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
        
      >
        {/* User Stack - Default */}
        <Stack.Screen 
          name="UserStack" 
          component={UserStack}
          options={{
            animation: 'fade',
          }}
        />
       
        {/* Auth Screens for Users */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
  name="TicketQRCode" 
  component={TicketQRCodeScreen} 
/>
        
        {/* Auth Screens for Organizers */}
        <Stack.Screen 
          name="OrganizerLogin" 
          component={OrganizerLoginScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="OrganizerRegister" 
          component={OrganizerRegisterScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        
        {/* Organizer Stack */}
        <Stack.Screen 
          name="OrganizerStack" 
          component={OrganizerStack}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
