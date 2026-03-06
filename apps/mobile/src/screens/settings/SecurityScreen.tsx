import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SecurityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Security</Text>
      <View style={styles.card}><Text style={styles.cardText}>Biometric Lock: Off</Text></View>
      <View style={styles.card}><Text style={styles.cardText}>Recovery Setup: Not configured</Text></View>
      <View style={styles.card}><Text style={styles.cardText}>Active Devices: 1</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F9FAFB' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8 },
  cardText: { fontSize: 16, color: '#374151' },
});
