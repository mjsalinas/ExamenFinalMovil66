import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useAuth } from '../context/AuthContext';

type RegisterScreenProps = {
  onBackToLogin: () => void;
};

export default function RegisterScreen({ onBackToLogin }: RegisterScreenProps) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert(
        'Campos requeridos',
        'Ingresa tu correo y una contraseña para continuar.'
      );
      return;
    }

    // El largo minimo lo valida Supabase segun la configuracion del proyecto, asi
    // que no se replica aca una regla que podria quedar desactualizada.
    if (password !== confirmPassword) {
      Alert.alert(
        'Las contraseñas no coinciden',
        'Verificá que hayas escrito la misma contraseña dos veces.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const { requiresEmailConfirmation } = await register(email, password);

      /*
       * Si hubo sesion, AuthProvider ya recibio el user y App.tsx cambio solo a
       * HomeScreen: esta pantalla quedo desmontada. Asi que llegar aca con la
       * sesion creada es practicamente imposible, y si se llegara no hay que
       * avisar nada porque el usuario ya esta dentro.
       */
      if (requiresEmailConfirmation) {
        Alert.alert(
          'Revisá tu correo',
          `Enviamos un email a ${email}. Confirmá la cuenta desde el link que ` +
            'llegó para poder iniciar sesión.'
        );
      }
    } catch (error) {
      Alert.alert(
        'No se pudo crear la cuenta',
        error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
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
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Registrate con tu correo y contraseña</Text>
          </View>

          <CustomInput
            label="Correo electrónico"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="input-register-email"
          />

          <CustomInput
            label="Contraseña"
            placeholder="Tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            testID="input-register-password"
          />

          <CustomInput
            label="Confirmar contraseña"
            placeholder="Repetí tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            testID="input-register-confirm-password"
          />

          <CustomButton
            title="Crear cuenta"
            onPress={handleRegister}
            variant="primary"
            loading={isSubmitting}
          />

          <Pressable
            onPress={onBackToLogin}
            accessibilityRole="button"
            style={styles.link}
          >
            <Text style={styles.linkText}>¿Ya tenés cuenta? Iniciá sesión</Text>
          </Pressable>
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
  link: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563eb',
  },
});
