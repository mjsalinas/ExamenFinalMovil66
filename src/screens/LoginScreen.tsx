import { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login, loginWithGoogle, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const handleLogin = async () => {
    if (isEmailLoading || isGoogleLoading) {
      return;
    }

    const missingFields = [];

    if (!email.trim()) {
      missingFields.push('el correo electronico');
    }

    if (!password) {
      missingFields.push('la contraseña');
    }

    if (missingFields.length > 0) {
      Alert.alert('Faltan datos', `Ingresa ${missingFields.join(' y ')} para continuar.`);
      return;
    }

    try {
      setIsEmailLoading(true);
      setRegisterError('');
      if (isRegisterMode) {
        const signedIn = await register(email.trim(), password);
        if (signedIn) {
          return;
        }

        Alert.alert(
          'Confirma tu correo',
          'La cuenta se creó. Revisa tu correo y confirma la dirección antes de iniciar sesión.',
        );
        setIsRegisterMode(false);
      } else {
        await login(email.trim(), password);
      }
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Revisa tus datos e inténtalo de nuevo.';

      if (isRegisterMode) {
        setRegisterError(message);
      } else {
        Alert.alert('No se pudo iniciar sesión', message);
      }
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isEmailLoading || isGoogleLoading) {
      return;
    }

    setIsGoogleLoading(true);

    try {
      await loginWithGoogle();
    } catch (error) {
      Alert.alert(
        'No se pudo iniciar sesión con Google',
        error instanceof Error ? error.message : 'Inténtalo de nuevo.',
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.intro}>
            <Text style={styles.heading}>
              {isRegisterMode ? 'Crear cuenta' : 'Inicia sesion'}
            </Text>
            <Text style={styles.description}>
              {isRegisterMode
                ? 'Regístrate con tu correo electrónico y una contraseña.'
                : 'Accede con el correo electronico y la contraseña de tu cuenta.'}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Correo electronico</Text>
              <CustomInput
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="nombre@correo.com"
                value={email}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <CustomInput
                onChangeText={setPassword}
                placeholder="Ingresa tu contraseña"
                secureTextEntry
                value={password}
              />
            </View>

            <CustomButton
              disabled={isEmailLoading || isGoogleLoading}
              onPress={handleLogin}
              title={
                isEmailLoading
                  ? isRegisterMode ? 'Creando cuenta...' : 'Iniciando sesion...'
                  : isRegisterMode ? 'Crear cuenta' : 'Iniciar sesion'
              }
            />
            {isEmailLoading && <ActivityIndicator color="#111111" />}
            {isRegisterMode && registerError ? (
              <Text accessibilityRole="alert" style={styles.errorMessage}>
                {registerError}
              </Text>
            ) : null}

            {!isRegisterMode && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerLabel}>O TAMBIEN</Text>
                  <View style={styles.dividerLine} />
                </View>

                <CustomButton
                  disabled={isGoogleLoading || isEmailLoading}
                  onPress={handleGoogleLogin}
                  title={isGoogleLoading ? 'Conectando con Google...' : 'Continuar con Google'}
                  variant="secondary"
                />
                {isGoogleLoading && <ActivityIndicator color="#111111" />}
              </>
            )}

            <Pressable
              accessibilityRole="button"
              disabled={isEmailLoading || isGoogleLoading}
              onPress={() => {
                setRegisterError('');
                setIsRegisterMode(!isRegisterMode);
              }}
              style={styles.modeToggle}
            >
              <Text style={styles.modeToggleText}>
                {isRegisterMode ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  intro: {
    marginBottom: 28,
  },
  heading: {
    color: '#111111',
    fontSize: 32,
    fontWeight: '700',
  },
  description: {
    marginTop: 8,
    color: '#555555',
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: '#222222',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    height: 1,
    flex: 1,
    backgroundColor: '#D0D0D0',
  },
  dividerLabel: {
    color: '#666666',
    fontSize: 10,
    fontWeight: '700',
  },
  modeToggle: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  modeToggleText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#B42318',
    fontSize: 14,
    lineHeight: 20,
  },
});