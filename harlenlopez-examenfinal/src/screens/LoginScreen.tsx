import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

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

  const handleGoogleLogin = async () => {
    try {
      
      const redirectUrl = AuthSession.makeRedirectUri();

      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true, 
        },
      });

      if (error) throw error;

      
      if (data?.url) {
        const response = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

       
       if (response.type === 'success') {
        const { url } = response;
        
       
        const paramsStr = url.split('#')[1] || url.split('?')[1] || '';
        const params = Object.fromEntries(paramsStr.split('&').map(p => p.split('=')));

        if (params.access_token && params.refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          if (sessionError) throw sessionError;
        }
      }
      }
    } catch (err: any) {
      console.error("Error en Google OAuth:", err);
      Alert.alert('Error', err.message || 'No se pudo iniciar sesión con Google');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi App - Login</Text>

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