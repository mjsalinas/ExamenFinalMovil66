import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import CustomButton from "../components/CustomButtom";
import CustomInput from "../components/CustomInput";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import * as AuthSession from "expo-auth-session";

export default function Login ({navigation}: any) {
    const {login} = useAuth();

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const ValidEmail = email.length > 0 && email.includes("@");
    const ValidPass = pass.length >= 6;

    const handleLogin = () => {
    if(ValidEmail && ValidPass){
        console.log(1)
    }else{
        console.log("error Email o Contraseña invalidos")
        Alert.alert("error", "email o contraseña invalidos")
    }
    };

    const handleGoogleLogin = async () => {
  const redirectUri = AuthSession.makeRedirectUri();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUri,
    },
  });

  if (error) {
    console.error("Error en login con Google:", error.message);
    Alert.alert("Error", "No se pudo iniciar sesión con Google");
  } else {
    console.log("Login con Google exitoso:", data);
    Alert.alert("Login exitoso", "Bienvenido!");

  }
};

    return(
        <View>
              <Text >Bienvenido a Login</Text>
              <CustomInput onChangeText={setEmail} value={email} placeholder={'Ingrese un correo'} type="email" />
              <CustomInput onChangeText={setPass} value={pass} placeholder={'Ingrese una contraseña'} type="password" />
              <CustomButton title='Iniciar Sesión' onPress={handleLogin} variant="primary" />
              <CustomButton title="Continuar con Google" onPress={handleGoogleLogin} variant="secondary"/>
            </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});