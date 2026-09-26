import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Ingresa correo y contraseña antes de continuar.');
      return;
    }

    Alert.alert('Inicio de sesión', 'Validación básica OK. Aún no se conecta Supabase.');
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google', 'Continuar con Google (pendiente de integración con Supabase).');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>ExpoApp</Text>
        <Text style={styles.title}>Iniciar sesión</Text>

        <CustomInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
        />

        <CustomInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomButton title="Iniciar sesión" onPress={handleLogin} variant="primary" />
        <CustomButton title="Continuar con Google" onPress={handleGoogleLogin} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef4ff',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1d4ed8',
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
});
