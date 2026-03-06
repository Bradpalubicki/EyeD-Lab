import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function NFCBandScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFC Band</Text>
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Band Status</Text>
        <Text style={styles.statusValue}>Not provisioned</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Provision Band</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
        <Text style={styles.secondaryButtonText}>Read Test</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 24 },
  statusCard: { backgroundColor: '#F9FAFB', padding: 20, borderRadius: 12, marginBottom: 24 },
  statusLabel: { fontSize: 14, color: '#6B7280' },
  statusValue: { fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 4 },
  button: { backgroundColor: '#0D9488', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButton: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#0D9488' },
  secondaryButtonText: { color: '#0D9488', fontSize: 16, fontWeight: '600' },
});
