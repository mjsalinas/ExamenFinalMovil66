import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import CustomButton from "../components/CustomButtom";
import CustomInput from "../components/CustomInput";
//import { useAuth } from "../context/AuthContext";

export default function Login ({navigation}: any) {
    //const {login} = useAuth();
    //definicion de variable en estado
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const ValidEmail = email.length > 0 && email.includes("@");
    const ValidPass = pass.length > 6;

    const handleLogin = () => {
    if(ValidEmail && ValidPass){
        console.log(1)
    }else{
        console.log("error Email o Contraseña invalidos")
        Alert.alert("error", "email o contraseña invalidos")
    }
    };

    const handleGoogle = () => {
    if(ValidEmail && ValidPass){
        console.log(1)
    }else{
        console.log("error Email o Contraseña invalidos")
        Alert.alert("error", "email o contraseña invalidos")
    }
    };

    return(
        <View>
              <Text >Bienvenido a Login</Text>
              <CustomInput onChangeText={setEmail} value={email} placeholder={'Ingrese un correo'} type="email" />
              <CustomInput onChangeText={setPass} value={pass} placeholder={'Ingrese una contraseña'} type="password" />
              <CustomButton title='Iniciar Sesión' onPress={handleLogin} variant="primary" />
              <CustomButton title="Continuar con Google" onPress={handleGoogle} variant="secondary"/>
            </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});