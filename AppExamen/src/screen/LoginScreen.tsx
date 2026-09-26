import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '@/context/AuthContext';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    // Validación básica de campos vacíos
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    const { error } = await login(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Error de Inicio de Sesión', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

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

      <View style={styles.spacer} />

      <CustomButton
        title={loading ? 'Cargando...' : 'Iniciar sesión'}
        onPress={handleLogin}
        variant="primary"
      />

      <CustomButton
        title="Continuar con Google"
        onPress={loginWithGoogle}
        variant="secondary"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  spacer: {
    height: 12,
  },
});

