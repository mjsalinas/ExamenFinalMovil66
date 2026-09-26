import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { AuthError, useAuth } from '@/context/AuthContext';

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Faltan datos', 'Ingresa tu correo y contraseña para continuar.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      // El navigator cambia al stack de sesión iniciada por su cuenta.
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Ocurrió un error, intenta de nuevo');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Si el usuario canceló el navegador, result.type !== 'success' y no pasa nada.
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Ocurrió un error, intenta de nuevo');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar sesión</Text>

          <CustomInput
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="tucorreo@ejemplo.com"
            type="email"
          />
          <CustomInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            type="password"
          />

          {error ? (
            <Text style={styles.errorText} selectable>
              {error}
            </Text>
          ) : null}

          <View style={styles.buttonSpacing}>
            <CustomButton title="Iniciar sesión" onPress={handleLogin} loading={loading} />
          </View>

          <CustomButton
            title="Continuar con Google"
            variant="secundary"
            onPress={handleGoogleLogin}
            loading={googleLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderCurve: 'continuous',
    padding: 20,
    gap: 16,
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
  },
  buttonSpacing: {
    marginTop: 4,
  },
});
