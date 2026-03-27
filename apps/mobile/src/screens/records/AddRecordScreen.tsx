import React from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function AddRecordScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Record</Text>
      <Text style={styles.label}>Record Type</Text>
      <TextInput style={styles.input} placeholder="e.g. Allergy, Medication, Condition" />
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} placeholder="e.g. Penicillin Allergy" />
      <Text style={styles.label}>Details</Text>
      <TextInput style={[styles.input, { height: 100 }]} placeholder="Additional details..." multiline />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#0D9488', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
