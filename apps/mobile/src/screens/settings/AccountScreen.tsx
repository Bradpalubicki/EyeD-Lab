import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Plan</Text>
        <Text style={styles.value}>Free Tier</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Records</Text>
        <Text style={styles.value}>0 / 50</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Storage</Text>
        <Text style={styles.value}>0 MB / 500 MB</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F9FAFB' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 16, color: '#6B7280' },
  value: { fontSize: 16, fontWeight: '600', color: '#374151' },
});
