import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function DashboardScreen({ navigation }: { navigation: any }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Health Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Health Summary</Text>
        <Text style={styles.cardText}>Blood Type: O+</Text>
        <Text style={styles.cardText}>2 Allergies | 3 Medications | 1 Condition</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Access</Text>
        <Text style={styles.cardText}>No recent access events</Text>
      </View>
      <TouchableOpacity style={styles.shareButton} onPress={() => navigation.navigate('Share')}>
        <Text style={styles.shareButtonText}>Quick Share</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>NFC Band Status</Text>
        <Text style={styles.cardText}>Not configured</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#F9FAFB' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#0D9488', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
  shareButton: { backgroundColor: '#0D9488', paddingVertical: 20, borderRadius: 16, alignItems: 'center', marginBottom: 16 },
  shareButtonText: { color: '#fff', fontSize: 20, fontWeight: '700' },
});
