import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import CustomButton from "../components/CustomButton";

export default function Home() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>

      <Text style={styles.email}>
        {user?.email ?? "Usuario"}
      </Text>

      <View style={styles.buttonWrapper}>
        <CustomButton
          title="Cerrar sesión"
          onPress={handleLogout}
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
    marginBottom: 15,
  },
  email: {
    fontSize: 18,
    marginBottom: 30,
  },
  buttonWrapper: {
    width: "100%",
    maxWidth: 360,
  },
});