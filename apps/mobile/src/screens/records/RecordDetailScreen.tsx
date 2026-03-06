import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecordDetailScreen({ route }: { route: any }) {
  const category = route?.params?.category || 'Record';
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Detail</Text>
      <Text style={styles.placeholder}>Record details will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  placeholder: { fontSize: 16, color: '#9CA3AF' },
});
