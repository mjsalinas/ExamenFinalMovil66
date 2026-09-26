import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.safeArea}>
        <LoginScreen />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
});