
 
 


import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, Image} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { useGoogleAuth } from '../lib/useGoogleAuth'; 

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState (false);
  const {login} = useAuth ();
  const { promptGoogleLogin, loadingGoogle } = useGoogleAuth(); 


const handleLogin = async () => {
  setLoading(true);
  const resultado = await login(email, password);
  setLoading(false);
  
  if (!resultado.exito) {
    Alert.alert('Error al iniciar sesion', resultado.error ?? 'Ha ocurrido un error');
  }
 
};

  const handleGoogleLogin = () => {
   
    console.log('Continuar con Google');
  };

  return (
    <SafeAreaView style={styles.container}>
        <Image source={require('../../assets/logokuromi-icon.jpeg')} style={styles.logo} />
      <Text style={styles.title}>Remind Me!</Text>

      <CustomInput
        placeholder="Correo electronico"
        value={email}
        onChangeText={setEmail}
      />
      <CustomInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <CustomButton title="Iniciar sesion" onPress={handleLogin} variant="primary" />
      <CustomButton
  title={loadingGoogle ? 'Conectando...' : 'Continuar con Google'}
  onPress={promptGoogleLogin}
  variant="secondary"
/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#e7e6f4',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    resizeMode: 'contain',
    borderRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 32,
    color: '#472b74',
  },
});






/**
 * 
 * INVESTIGACIN:
 * segui la guia oficial de Supabase
 * y la documentacion de expo sobre expo-auth-session / expo-web-browser para flujos
 * de OAuth con proveedores externos en apps de react
 *
 * configuracion que si se realizo:
 * 1. Google Cloud Console: cree un proyecto, configure la pantalla de consentimiento
 *    OAuth, agregue mi correo como test usery habilite los scopes
 *    openid/email/profile, y genere un Client ID y Client Secret
 * 2. En authorized redirect URIs de Google Cloud pegue la callback URL que
 *    provee Supabase
 * 3. Supabase: active el proveedor Google en Authentication Providers, pegando
 *    el Client ID y Client Secret que se generaron
 * 4. Supabase: agregue "remindmeapp://" comoredirect URL permitido en
 *    authentication URL Configuration
 * 5. app.json: defin "scheme": "remindmeapp" para que la app pueda recibir
 *    deep links de regreso tras la autenticacon
 * 6. implemente el flujo con supabase.auth.signInWithOAuth() para abrir el navegador y que me de el
 *    redirect con el access_token/refresh_token
 *
 * resultado de mis pruebas:
 * el flujo funciona correctamente hasta el paso de seleccion de cuenta: al
 * presionar Continuar con Google se abre el navegador con la pantalla de
 * Google, y permite elegir la cuenta de correo sin errores
 *
 * BLOQUEO ENCONTRADO:
 * cuando selecciono la cuenta, Google intenta redirigir de vuelta a la app usando
 * el scheme personalizado "remindmeapp://", pero el sistema operativo no lo
 * reconoce y en su lugar abre Gmail (o se queda en el navegador). En mi segundo intento, esta vez la pantalla}
 * lleva a un local host como null y en mi tercer intento fue devuelta a Gmail
 
 /** */