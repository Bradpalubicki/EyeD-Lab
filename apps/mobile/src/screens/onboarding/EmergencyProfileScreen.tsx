import React from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function EmergencyProfileScreen({ navigation }: { navigation: any }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Emergency Profile</Text>
      <Text style={styles.label}>Blood Type</Text>
      <TextInput style={styles.input} placeholder="e.g. O+" />
      <Text style={styles.label}>Allergies</Text>
      <TextInput style={styles.input} placeholder="e.g. Penicillin, Peanuts" />
      <Text style={styles.label}>Current Medications</Text>
      <TextInput style={styles.input} placeholder="e.g. Metformin 500mg" />
      <Text style={styles.label}>Conditions</Text>
      <TextInput style={styles.input} placeholder="e.g. Type 2 Diabetes" />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EmergencyContacts')}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0D9488', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#0D9488', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
