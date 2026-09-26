import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { AuthProvider } from "./src/contexts/AuthContext";



function AppNavigation() {
  const { colors, isDark } = useTheme();
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          primary: colors.primary,
        },
      }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <StackNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BooksProvider>
          <AppNavigation />
        </BooksProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
