import React from 'react';
import { StyleSheet, View } from 'react-native';
import Home from './src/screen/Home';
import Login from './src/screen/Login';
import { AuthProvider, useAuth } from './src/context/AuthContext';


const RootNavigator = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {user ? <Home /> : <Login/>}
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});