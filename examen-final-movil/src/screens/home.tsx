import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import CustomButton from '@/components/CustomButton';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      // El navigator cambia solo a Login al perderse la sesión.
    } catch {
      Alert.alert('Error', 'No se pudo cerrar sesión, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido{user?.email ? `, ${user.email}` : ''}!</Text>
      <CustomButton
        title="Cerrar sesión"
        variant="secundary"
        onPress={handleLogout}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
});
