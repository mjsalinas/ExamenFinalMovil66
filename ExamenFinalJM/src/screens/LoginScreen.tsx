import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen(){
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {logout, login, register} = useAuth();

    const validEmail = email.length > 0 && email.includes("@");
    const validPassword = password.length > 6;

    const handleLogin  = ()=>{
        if(validEmail && validPassword){
            login(email,password);
        }else{
            console.log("error email o password no valido")
            Alert.alert('alerta', 'error email o password no valido')
        }
    }

    const handleRegister  = ()=>{
        if(validEmail && validPassword){
            register(email,password);
        }else{
            console.log("error email o password no valido")
            Alert.alert('alerta', 'error email o password no valido')
        }
    }

     const handlelogout = () => logout()

    const handleGoogle  = ()=>{
        if(validEmail && validPassword){
            console.log(2)
        }else{
            console.log("error email o password no valido");
            
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido a Login</Text>
            <Text>Profavor ingrese su correo y contraseña</Text>

            <CustomInput onChangeText={setEmail} value={email} PlaceHolder="example@gmail.com"/>
            <CustomInput onChangeText={setPassword} value={password} PlaceHolder="mas de 6 digitos" secureTextEntry={true}/>

            <CustomButton title="Iniciar Sesion" onPress={handleLogin} variant='primary' />
            <CustomButton title="Registrarse" onPress={handleRegister} variant='primary' />
            <CustomButton title="Cerrar Sesion" onPress={handlelogout} variant='primary' />
            <CustomButton title="Iniciar con Google" onPress={handleGoogle} variant='secondary'/>

        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    fontSize: 30,
  }
});