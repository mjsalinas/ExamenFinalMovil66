import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CustomButton from "../components/custom-button";
import CustomInput from "../components/custom-input";
import { useAuth } from "../context/AuthContext";
import { showAlert } from "../lib/alert";
import { colors } from "../theme/colors";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const { login, loginWithGoogle, logout } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert("Campos vacíos", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    setSubmitting(true);
    const { error } = await login(email, password);
    setSubmitting(false);

    if (error) {
      showAlert("Error al iniciar sesión", error);
      return;
    }

    showAlert("Bienvenido", "Has iniciado sesión correctamente.");
  };

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      showAlert("Error al cerrar sesión", error);
      return;
    }
    showAlert("Sesión cerrada", "Has cerrado sesión correctamente.");
  };

  const handleGoogleLogin = async () => {
    setGoogleSubmitting(true);
    const { error } = await loginWithGoogle();
    setGoogleSubmitting(false);

    if (error) {
      showAlert("Error con Google", error);
      return;
    }

    showAlert("Bienvenido", "Has iniciado sesión con Google.");
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="phone-portrait-outline" size={40} color={colors.onPrimary} />
          </View>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

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
          secureTextEntry
        />

        <View style={styles.actions}>
          <CustomButton
            title={submitting ? "Ingresando..." : "Iniciar sesión"}
            onPress={handleLogin}
            variant="primary"
            disabled={submitting || googleSubmitting}
          />
          <CustomButton
            title={googleSubmitting ? "Conectando..." : "Continuar con Google"}
            onPress={handleGoogleLogin}
            variant="secondary"
            disabled={googleSubmitting || submitting}
          />
          <CustomButton
            title={"Cerrar sesión"}
            onPress={handleLogout}
            variant="tertiary"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 4,
  },
  actions: {
    marginTop: 8,
  },
});
