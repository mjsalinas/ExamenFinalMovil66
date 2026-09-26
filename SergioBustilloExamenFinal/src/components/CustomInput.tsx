import { useState } from "react";
import React  from "react";
import { Text, KeyboardTypeOptions, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";

type CustomInputProps = {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?:boolean;
    type?: "default" | "email" | "password" | "number";
};

export default function CustomInput({onChangeText, value, placeholder, type= "default"}: CustomInputProps){
    const [isSecureText, setIsSecureText] = useState(type === "password")

        const isPasswordField = type === "password";

        const keyboardType: KeyboardTypeOptions = 
        type === "email" ? "email-address" :
        type === "number" ? "number-pad":
        "default";

        const getError = () =>{
        if(type === "email" && !value.includes("@") && !value.includes(".")){
            return "Correo invalido";
        }
        if(type === "password" && value.length < 6){
            return "Contraseña invalida";
        }
        return undefined;
    };
        const error = getError();

        return(
        <View style={styles.wrapper}>
            <View style={[styles.inputContainer, error && styles.inputError]}>

        <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#999"
            keyboardType={keyboardType}
            secureTextEntry={isSecureText}
        />
        {isPasswordField && <TouchableOpacity
        onPress={() => {
            setIsSecureText(!isSecureText);
        }}>
        </TouchableOpacity>}
        </View>
        {error && <Text style={styles.inputError}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper:{
        width: '100%',
        marginBottom: 14,
    },
        inputContainer:{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: "space-between",
            borderRadius: 8,
            borderColor: "#D9DDE2",
            borderWidth: 1,
            paddingLeft: 20,
            paddingRight: 20,
            height:52,
            marginBottom: 4,
            backgroundColor: "#F8F9FA",
            paddingHorizontal: 15,
        },
        inputError:{
            color: 'red',
            borderColor: '#E53935',
            backgroundColor: '#FFF8F8',
            marginTop: 5,
            marginLeft: 5,
        },
        input:{
            width: '80%',
        },
    })

