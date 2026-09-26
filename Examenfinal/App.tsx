import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { CustomButton } from './src/components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const MainContent = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Bienvenido!</Text>
      <Text style={styles.subtext}>{user.email}</Text>
      <CustomButton title="Cerrar sesión" onPress={logout} variant="secondary" />
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.safeArea}>
        <MainContent />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
});