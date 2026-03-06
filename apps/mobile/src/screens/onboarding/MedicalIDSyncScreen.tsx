import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MedicalIDSyncScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sync Medical ID</Text>
      <Text style={styles.description}>
        EyeD will auto-populate your phone's Medical ID so emergency responders can see your critical
        health info from the lock screen.
      </Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>iOS</Text>
        <Text style={styles.infoText}>Syncs with Apple Health Medical ID</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Android</Text>
        <Text style={styles.infoText}>Syncs with Android Safety / Emergency Info</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NFCBandSetup')}>
        <Text style={styles.buttonText}>Sync Now</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('NFCBandSetup')}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0D9488', marginBottom: 16 },
  description: { fontSize: 16, color: '#6B7280', marginBottom: 24, lineHeight: 24 },
  infoBox: { backgroundColor: '#F0FDFA', padding: 16, borderRadius: 12, marginBottom: 12 },
  infoTitle: { fontSize: 16, fontWeight: '600', color: '#0D9488' },
  infoText: { fontSize: 14, color: '#374151', marginTop: 4 },
  button: { backgroundColor: '#0D9488', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  skipText: { color: '#6B7280', textAlign: 'center', marginTop: 16, fontSize: 14 },
});
