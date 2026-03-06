import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import RegistrationScreen from '../screens/onboarding/RegistrationScreen';
import EmergencyProfileScreen from '../screens/onboarding/EmergencyProfileScreen';
import EmergencyContactsScreen from '../screens/onboarding/EmergencyContactsScreen';
import MedicalIDSyncScreen from '../screens/onboarding/MedicalIDSyncScreen';
import NFCBandSetupScreen from '../screens/onboarding/NFCBandSetupScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="EmergencyProfile" component={EmergencyProfileScreen} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
      <Stack.Screen name="MedicalIDSync" component={MedicalIDSyncScreen} />
      <Stack.Screen name="NFCBandSetup" component={NFCBandSetupScreen} />
    </Stack.Navigator>
  );
}
