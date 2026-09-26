import { Alert, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert(
        'No se pudo cerrar sesión',
        error instanceof Error ? error.message : 'Inténtalo de nuevo.',
      );
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.heading}>Inicio</Text>
        <Text style={styles.description}>Sesión activa en Supabase</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <CustomButton onPress={handleLogout} title="Cerrar sesión" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: 16,
  },
  heading: {
    color: '#111111',
    fontSize: 32,
    fontWeight: '700',
  },
  description: {
    color: '#555555',
    fontSize: 16,
  },
  email: {
    color: '#111111',
    fontSize: 15,
    marginBottom: 12,
  },
});