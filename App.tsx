// App.tsx
import React from "react";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";
import Home from "./src/screens/Home";

function RootNavigator() {
  const { user } = useAuth();
  return user ? <Home /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}