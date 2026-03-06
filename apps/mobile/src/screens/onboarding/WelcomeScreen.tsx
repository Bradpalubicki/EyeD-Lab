import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to EyeD</Text>
      <Text style={styles.subtitle}>Your eyes. Your records. Your control.</Text>
      <View style={styles.features}>
        <Text style={styles.feature}>Encrypted medical records you own</Text>
        <Text style={styles.feature}>Share via QR code + PIN</Text>
        <Text style={styles.feature}>NFC band for emergencies</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Registration')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0D9488', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
  features: { marginBottom: 40 },
  feature: { fontSize: 16, color: '#374151', marginBottom: 12, paddingLeft: 8 },
  button: { backgroundColor: '#0D9488', paddingHorizontal: 48, paddingVertical: 16, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
