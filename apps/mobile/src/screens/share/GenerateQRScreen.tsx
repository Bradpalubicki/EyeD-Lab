import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GenerateQRScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Records</Text>
      <Text style={styles.label}>Select scope:</Text>
      <View style={styles.scopeRow}>
        {['Allergies', 'Medications', 'Conditions', 'Labs', 'Full'].map((s) => (
          <TouchableOpacity key={s} style={styles.scopeChip}>
            <Text style={styles.scopeText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Duration:</Text>
      <View style={styles.scopeRow}>
        {['1 hour', '24 hours', '1 week', 'Custom'].map((d) => (
          <TouchableOpacity key={d} style={styles.scopeChip}>
            <Text style={styles.scopeText}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Generate QR Code</Text>
      </TouchableOpacity>
      <View style={styles.qrPlaceholder}>
        <Text style={styles.qrText}>QR code will appear here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  scopeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  scopeChip: { backgroundColor: '#F0FDFA', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#0D9488' },
  scopeText: { color: '#0D9488', fontSize: 14 },
  button: { backgroundColor: '#0D9488', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  qrPlaceholder: { alignItems: 'center', padding: 40, backgroundColor: '#F3F4F6', borderRadius: 16 },
  qrText: { color: '#9CA3AF', fontSize: 16 },
});
