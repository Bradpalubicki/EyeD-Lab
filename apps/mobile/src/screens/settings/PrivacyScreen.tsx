import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Audit Log</Text>
        <Text style={styles.cardText}>No access events recorded</Text>
      </View>
      <TouchableOpacity style={styles.dangerButton}>
        <Text style={styles.dangerText}>Request Data Deletion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F9FAFB' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 4 },
  cardText: { fontSize: 14, color: '#9CA3AF' },
  dangerButton: { borderWidth: 2, borderColor: '#EF4444', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  dangerText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
});
