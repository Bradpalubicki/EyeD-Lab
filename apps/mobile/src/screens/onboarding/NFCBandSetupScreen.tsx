import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function NFCBandSetupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFC Band Setup</Text>
      <Text style={styles.description}>
        Your NFC wristband stores emergency medical info that any smartphone can read — no app needed.
      </Text>
      <View style={styles.tapArea}>
        <Text style={styles.tapIcon}>📱</Text>
        <Text style={styles.tapText}>Tap your band to your phone</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Write to Band</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.skipText}>I don't have a band yet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0D9488', marginBottom: 16 },
  description: { fontSize: 16, color: '#6B7280', marginBottom: 32, lineHeight: 24 },
  tapArea: { alignItems: 'center', padding: 40, backgroundColor: '#F0FDFA', borderRadius: 24, marginBottom: 32 },
  tapIcon: { fontSize: 48, marginBottom: 16 },
  tapText: { fontSize: 18, color: '#374151', fontWeight: '500' },
  button: { backgroundColor: '#0D9488', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  skipText: { color: '#6B7280', textAlign: 'center', marginTop: 16, fontSize: 14 },
});
