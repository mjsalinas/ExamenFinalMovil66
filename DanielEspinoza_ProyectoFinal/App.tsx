import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { AuthProvider } from "./src/context/AuthContext";
import LoginScreen from "./src/screens/login-screen";
import { colors } from "./src/theme/colors";

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <LoginScreen />
        <StatusBar style="dark" />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
