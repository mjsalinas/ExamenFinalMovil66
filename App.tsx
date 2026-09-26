import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

function Root() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <View style={styles.container} />;
  }

  return user ? <HomeScreen /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <Root />
        <StatusBar style="auto" />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
