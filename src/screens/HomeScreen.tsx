import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import WelcomeCard from '../components/WelcomeCard';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.eyebrow}>Examen Final</Text>
      <WelcomeCard
        title="Proyecto Expo inicial"
        subtitle="Estructura base lista para continuar con la Parte II: autenticación y Supabase."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
});
