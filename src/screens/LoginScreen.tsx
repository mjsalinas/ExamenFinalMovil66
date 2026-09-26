
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert(
        "Campos obligatorios",
        "Por favor, ingresa tu correo y contraseña."
      );
      return;
    }

    try {
      await login(email.trim(), password);

      Alert.alert(
        "Inicio de sesión",
        "Inicio de sesión exitoso."
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "No se pudo iniciar sesión."
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Genera el redirect correcto para Expo Go
      const redirectUrl = makeRedirectUri({
        scheme: "examenfinalmovil66",
        path: "auth/callback",
      });

      console.log("Redirect URL:", redirectUrl);

      // Iniciar autenticación con Google mediante Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        throw error;
      }

      if (!data?.url) {
        throw new Error(
          "No se pudo obtener la URL de autenticación de Google."
        );
      }

      // Abrir navegador para seleccionar la cuenta de Google
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      console.log("Resultado OAuth:", result);

      if (result.type !== "success") {
        return;
      }

      const returnedUrl = result.url;

      // Obtener parámetros devueltos por Supabase
      const hash = returnedUrl.split("#")[1] ?? "";
      const query = returnedUrl.split("?")[1]?.split("#")[0] ?? "";

      const hashParams = new URLSearchParams(hash);
      const queryParams = new URLSearchParams(query);

      // Flujo PKCE
      const code = queryParams.get("code");

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          throw exchangeError;
        }
      } else {
        // Flujo con tokens
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (!accessToken || !refreshToken) {
          throw new Error(
            "No se pudo obtener la sesión de Google."
          );
        }

        const { error: sessionError } =
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

        if (sessionError) {
          throw sessionError;
        }
      }

      Alert.alert(
        "Inicio de sesión",
        "Inicio de sesión con Google exitoso."
      );

      // AuthContext detectará la sesión mediante
      // onAuthStateChange.
    } catch (error: any) {
      console.log("Error Google OAuth:", error);

      Alert.alert(
        "Error con Google",
        error.message || "No se pudo iniciar sesión con Google."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jutaru Control</Text>
      <Text style={styles.subtitle}>Iniciar sesion</Text>

      <View style={styles.form}>
        <CustomInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
        />

        <CustomInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomButton
          title="Iniciar sesion"
          onPress={handleLogin}
          variant="primary"
        />

        <CustomButton
          title="Continuar con Google"
          onPress={handleGoogleLogin}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 30,
  },
  form: {
    width: "100%",
    maxWidth: 360,
  },
});
