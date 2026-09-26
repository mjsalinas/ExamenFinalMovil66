import {createNativeStackNavigator} from "@react-navigation/native-stack"
import Login from "../screens/Login";
import Register from "../screens/Register";
import TabsNavigator from "./TbsNavigator";



//1. declarar el tipado de las pantallas con sus paraemtros
export type RootStackParamList ={
    LoginScreen: undefined,
    RegisterScreen: undefined,
    UserTabs: undefined,
};

//2. crear el stack navigator encargado de manejar la navegacion
const Stack = createNativeStackNavigator <RootStackParamList>();

//3. utilizar el stack ne navegacion
export default function StackNavigator (){
    return(
        <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen name='LoginScreen' component={Login} />
            <Stack.Screen name='RegisterScreen' component={Register} />
            <Stack.Screen name='UserTabs' component={TabsNavigator} />
        </Stack.Navigator>
    );
}