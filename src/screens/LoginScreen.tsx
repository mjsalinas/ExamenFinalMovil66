import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const {login} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor, completa el correo y la contraseña.');
      return;
    }

    Alert.alert('Éxito', 'Bienvenido.');
  };

  const handleGoogleLogin = () => {
    console.log('Iniciando flujo de Google OAuth');
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Examen Final II</Text>
      <Text style={styles.subtitle}>Bienvenido</Text>

      <CustomInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        type="email"
      />

      <CustomInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        type="password"
        secureTextEntry={true} 
      />

      <CustomButton
        title="Iniciar sesión"
        onPress={handleLogin}
        variant="primary"
      />

      <CustomButton
        title="Continuar con Google"
        onPress={handleGoogleLogin}
        variant="secondary"
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 5,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF', 
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 16,
    color: '#666',
  }
});