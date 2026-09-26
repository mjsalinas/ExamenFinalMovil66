import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { UseAuth } from "../context/Authcontex";



export default function Login({navigation} : any) {
  const{login}= UseAuth();
  //definicion de variable en estado
  const [email, setEmail] = useState("");
  
 const [password, setPassword] = useState("");
  //asignacion de nuevo valor a variable
  // setEmail("maria@unitec.edu")

  const handleLogin = () => {
    const allowed=login(email);
    if (allowed){
    
   
    navigation.navigate('UserTabs', {screen:'HomeTab',params:{email}});
     }else{
      console.log("Usuario sin acceso");
  }
};
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <CustomInput
        onChangeText={setEmail}
        value={email}
        placeholder={"Ingresa tu email"}
        type="email"
      />
      <CustomInput
        onChangeText={setPassword}
        value={password}
        placeholder={"Ingresa tu contraseña"}
        type="password"
      />
      <CustomButton
        title="Iniciar Sesion"
        onPress={handleLogin}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});