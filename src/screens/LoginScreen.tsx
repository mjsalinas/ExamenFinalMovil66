import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos incompletos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email.trim(), password);
      // Si tuvieras navegación (React Navigation), aquí harías:
      // navigation.replace('Home');
    } catch (err: any) {
      Alert.alert('Error al iniciar sesión', err.message ?? 'Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setSubmitting(true);
      await loginWithGoogle();
    } catch (err: any) {
      Alert.alert('Error con Google', err.message ?? 'Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Mi App</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <View style={styles.form}>
        <CustomInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <CustomInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomButton
          title={submitting ? 'Cargando...' : 'Iniciar sesión'}
          onPress={handleLogin}
          variant="primary"
        />
        <CustomButton
          title="Continuar con Google"
          onPress={handleGoogleLogin}
          variant="secondary"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#111',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#777',
    marginBottom: 32,
  },
  form: { width: '100%' },
});