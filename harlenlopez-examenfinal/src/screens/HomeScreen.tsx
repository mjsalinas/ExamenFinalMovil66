import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../contexts/AuthContext';

export const HomeScreen = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenid@!</Text>
      <Text style={styles.subtitle}>Sesión activa: {user?.email}</Text>
      
      <CustomButton title="Cerrar sesión" onPress={logout} variant="secondary" />
    </View>
  );
};



const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    alignItems: 'center' 
},
  title: { 
    fontSize: 26, 
    fontWeight: 'bold' 
},
  subtitle: { 
    fontSize: 16, 
    marginVertical: 20 
}
});