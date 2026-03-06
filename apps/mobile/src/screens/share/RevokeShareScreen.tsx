import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RevokeShareScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Revoke Access</Text>
      <Text style={styles.empty}>No sessions to revoke</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  empty: { fontSize: 16, color: '#9CA3AF', textAlign: 'center', marginTop: 40 },
});
