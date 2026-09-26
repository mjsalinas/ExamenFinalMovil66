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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = () => {
    if (!email || !password) {
      Alert.alert(
        'Campos requeridos',
        'Ingresa tu correo y tu contraseña para continuar.'
      );
      return;
    }

    // Parte 2.3: conectar con Supabase signInWithPassword
  };

  const handleGoogleLogin = () => {
    // Parte 2.4: conectar con Supabase OAuth
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
          />

          <CustomButton
            title="Continuar con Google"
            onPress={handleGoogleLogin}
            variant="secondary"
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
