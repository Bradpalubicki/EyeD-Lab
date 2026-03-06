import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const menuItems = [
  { label: 'Account', screen: 'Account' },
  { label: 'Security', screen: 'Security' },
  { label: 'Privacy', screen: 'Privacy' },
  { label: 'NFC Band', screen: 'NFCBand' },
  { label: 'Notifications', screen: 'Settings' },
  { label: 'Language', screen: 'Settings' },
];

export default function SettingsScreen({ navigation }: { navigation: any }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {menuItems.map((item) => (
        <TouchableOpacity key={item.label} style={styles.menuItem} onPress={() => navigation.navigate(item.screen)}>
          <Text style={styles.menuText}>{item.label}</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#F9FAFB' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  menuItem: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuText: { fontSize: 16, color: '#374151' },
  arrow: { fontSize: 24, color: '#9CA3AF' },
});
