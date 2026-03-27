import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const categories = ['Allergies', 'Medications', 'Conditions', 'Labs', 'Imaging', 'Procedures', 'Immunizations'];

export default function RecordListScreen({ navigation }: { navigation: any }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Medical Records</Text>
      {categories.map((cat) => (
        <TouchableOpacity key={cat} style={styles.card} onPress={() => navigation.navigate('RecordDetail', { category: cat })}>
          <Text style={styles.cardTitle}>{cat}</Text>
          <Text style={styles.cardCount}>0 records</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddRecord')}>
        <Text style={styles.addButtonText}>+ Add Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#F9FAFB' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#374151' },
  cardCount: { fontSize: 14, color: '#9CA3AF' },
  addButton: { backgroundColor: '#0D9488', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
