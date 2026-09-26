import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

type AuthScreen = 'login' | 'register';

function Root() {
  const { user, isLoading } = useAuth();
  const [screen, setScreen] = useState<AuthScreen>('login');

  if (isLoading) {
    return <View style={styles.container} />;
  }

  if (user) {
    return <HomeScreen />;
  }

  /*
   * No hay libreria de navegacion en el proyecto, asi que la navegacion entre
   * login y registro es estado. Cuando hay sesion manda HomeScreen y este estado
   * queda sin efecto, asi que no hace falta resetearlo al cerrar sesion.
   */
  if (screen === 'register') {
    return <RegisterScreen onBackToLogin={() => setScreen('login')} />;
  }

  return <LoginScreen onRegisterPress={() => setScreen('register')} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <View style={styles.container}>
          <Root />
          <StatusBar style="auto" />
        </View>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
