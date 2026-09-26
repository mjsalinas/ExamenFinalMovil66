import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();

  const handleAuth = (action: 'login' | 'register') => {
    if (!email || !password) {
      Alert.alert('Error', 'El correo y la contraseña son obligatorios');
      return;
    }
    action === 'login' ? login(email, password) : register(email, password);
  };

  
    /* 
      Nota  Google:
      Ing leI la documentación de Supabase para Expo y medio comprendi la logica 
      entiendo que se usa supabase.auth.signInWithOAuth({ provider: 'google' }) 
      y que hay que usar expo-auth-session para atrapar el deep link de regreso

      trate la estructura, pero me trabé configurando los Client IDs en la consola 
      de google cloud
    */
  const handleGoogleLogin = async () => {
    try {
      console.log('Iniciando intento de Google OAuth...');
      
    
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
         
          redirectTo: 'harlenlopez-examenfinal://google-callback', 
        },
      });

      if (error) {
       
        console.warn("Error esperado por falta de GCP:", error.message);
        Alert.alert(
          'Implementación Parcial OAuth', 
          'Se implementó signInWithOAuth, pero el flujo se interrumpe por falta de credenciales de Google Cloud Console'
        );
        return;
      }

      if (data?.url) {
        console.log("URL del proveedor generada:", data.url);
      }

    } catch (err) {
      console.error("Excepción en flujo de Google:", err);
    }
  };
      
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTRO NACIONAL DE LAS PERSONAS RNP :)</Text>

      <CustomInput placeholder="Correo electrónico" value={email} onChangeText={setEmail} />
      <CustomInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry={true} />

      <CustomButton title="Iniciar sesión" onPress={() => handleAuth('login')} variant="primary" />
      <CustomButton title="Registrarse" onPress={() => handleAuth('register')} variant="primary" />
      <CustomButton title="Continuar con Google" onPress={handleGoogleLogin} variant="secondary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#f5f5f5' 
},
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20 
}
});