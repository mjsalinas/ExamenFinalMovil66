import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert(
        "Campos obligatorios",
        "Por favor, ingresa tu correo y contraseña."
      );
      return;
    }

    
    Alert.alert("Login", "Datos ingresados correctamente.");
  };

  const handleGoogleLogin = () => {
    Alert.alert(
      "Google",
      "El inicio de sesión con Google se configurará en la Parte II."
    );
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
