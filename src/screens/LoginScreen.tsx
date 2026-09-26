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
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../lib/googleAuth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        'Campos requeridos',
        'Ingresa tu correo y tu contraseña para continuar.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert(
        'No se pudo iniciar sesión',
        error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert(
        'No se pudo iniciar sesion con Google',
        error instanceof Error ? error.message : 'Ocurrio un error inesperado.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <Text style={styles.subtitle}>Accede a tu cuenta para continuar</Text>
          </View>

          <CustomInput
            label="Correo electrónico"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="input-email"
          />

          <CustomInput
            label="Contraseña"
            placeholder="Tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            testID="input-password"
          />

          <CustomButton
            title="Iniciar sesión"
            onPress={handleEmailLogin}
            variant="primary"
            loading={isSubmitting}
          />

          <CustomButton
            title="Continuar con Google"
            onPress={handleGoogleLogin}
            variant="secondary"
            loading={isSubmitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: '#6b7280',
  },
});
