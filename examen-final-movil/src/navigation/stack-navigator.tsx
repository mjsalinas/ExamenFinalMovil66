import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import Home from '@/screens/home';
import Login from '@/screens/login';

export type RootStackParamList = {
  login: undefined;
  home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="home" component={Home} />
      ) : (
        <Stack.Screen name="login" component={Login} />
      )}
    </Stack.Navigator>
  );
}
