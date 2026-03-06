import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import RecordListScreen from '../screens/records/RecordListScreen';
import RecordDetailScreen from '../screens/records/RecordDetailScreen';
import AddRecordScreen from '../screens/records/AddRecordScreen';
import GenerateQRScreen from '../screens/share/GenerateQRScreen';
import ActiveSharesScreen from '../screens/share/ActiveSharesScreen';
import EmergencyProfileEditorScreen from '../screens/emergency/EmergencyProfileEditorScreen';
import NFCBandScreen from '../screens/emergency/NFCBandScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import AccountScreen from '../screens/settings/AccountScreen';
import SecurityScreen from '../screens/settings/SecurityScreen';
import PrivacyScreen from '../screens/settings/PrivacyScreen';

const Tab = createBottomTabNavigator();
const RecordsStack = createNativeStackNavigator();
const ShareStack = createNativeStackNavigator();
const EmergencyStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

function RecordsNavigator() {
  return (
    <RecordsStack.Navigator>
      <RecordsStack.Screen name="RecordList" component={RecordListScreen} options={{ title: 'Records' }} />
      <RecordsStack.Screen name="RecordDetail" component={RecordDetailScreen} options={{ title: 'Detail' }} />
      <RecordsStack.Screen name="AddRecord" component={AddRecordScreen} options={{ title: 'Add Record' }} />
    </RecordsStack.Navigator>
  );
}

function ShareNavigator() {
  return (
    <ShareStack.Navigator>
      <ShareStack.Screen name="GenerateQR" component={GenerateQRScreen} options={{ title: 'Share' }} />
      <ShareStack.Screen name="ActiveShares" component={ActiveSharesScreen} options={{ title: 'Active Shares' }} />
    </ShareStack.Navigator>
  );
}

function EmergencyNavigator() {
  return (
    <EmergencyStack.Navigator>
      <EmergencyStack.Screen name="EmergencyProfile" component={EmergencyProfileEditorScreen} options={{ title: 'Emergency' }} />
      <EmergencyStack.Screen name="NFCBand" component={NFCBandScreen} options={{ title: 'NFC Band' }} />
    </EmergencyStack.Navigator>
  );
}

function SettingsNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="SettingsHome" component={SettingsScreen} options={{ title: 'Settings' }} />
      <SettingsStack.Screen name="Account" component={AccountScreen} />
      <SettingsStack.Screen name="Security" component={SecurityScreen} />
      <SettingsStack.Screen name="Privacy" component={PrivacyScreen} />
    </SettingsStack.Navigator>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Records" component={RecordsNavigator} />
      <Tab.Screen name="Share" component={ShareNavigator} />
      <Tab.Screen name="Emergency" component={EmergencyNavigator} />
      <Tab.Screen name="Settings" component={SettingsNavigator} />
    </Tab.Navigator>
  );
}
