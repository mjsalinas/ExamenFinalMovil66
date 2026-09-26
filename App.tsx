

import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './src/context/Authcontex';
import StackNavigator from './src/navigation/StackNavigator';



export default function App() {
return(
  <AuthProvider>

  <NavigationContainer>
    <StackNavigator/>
  </NavigationContainer>
    </AuthProvider>
);

}