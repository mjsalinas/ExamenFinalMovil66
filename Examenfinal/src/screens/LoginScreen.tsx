import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error de validación', 'El correo y la contraseña son obligatorios.');
      return;
    }

    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Error de autenticación', error.message);
    }
  };

  const handleRegister = async () => {
   
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error de validación', 'El correo y la contraseña son obligatorios.');
      return;
    }

    try {
      await register(email, password);
      Alert.alert('Éxito', 'Usuario creado correctamente. Ya puedes iniciar sesión.');
    } catch (error: any) {
      Alert.alert('Error al registrar', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión a tu app favorita</Text>

      <CustomInput
        placeholder="Ingrese su Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />

      <CustomInput
        placeholder="Ingrese su Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Iniciar sesión"
          onPress={handleLogin}
          variant="primary"
        />

        <CustomButton
          title="Registrarse"
          onPress={handleRegister}
          variant="secondary"
        />

        <CustomButton
          title="Continuar con Google"
          onPress={loginWithGoogle}
          variant="secondary"
        />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1C1C1E',
  },
  buttonContainer: {
    marginTop: 16,
  },
});