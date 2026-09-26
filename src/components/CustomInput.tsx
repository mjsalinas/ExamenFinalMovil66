import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

type CustomInputProps = {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    type?: "default" | "email" | "password" | "number"; 
};

export default function CustomInput({
    placeholder,
    value,
    onChangeText,
    type = "default"

    }: CustomInputProps) {
        const [isSecureText, setIsSecureText] = useState(type === "password");

        const isPasswordField = type === "password";

        const iconName: (typeof MaterialIcons) ["name"] | undefined =
        type === "password" ? "lock" :
        type === "email" ? "alternate-email" :
        undefined;

        const keyboardType: KeyboardTypeOptions =
        type === "email" ? "email-address" : 
        type === "number" ? "number-pad" : "default";

        const getError = () => {
            if (!value) return '';

            if (type === "email" && !value.includes("@")){
                return 'Correo inválido';
            }

            if (type === "password" && value.length < 4){
                return "La contraseña es debil";
            }

            return '';
        };

        const error = getError();
        
        return (
            <View style={styles.wrapper}>

                <View style={[styles.inputContainer, error ? styles.inputError : null]}>    
                {iconName && <MaterialIcons name={iconName as any} size={22} color="#555" />}

                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isSecureText}
                    keyboardType={keyboardType}
                />
                { isPasswordField && <TouchableOpacity
            onPress={()=>{
                setIsSecureText(!isSecureText);
            }}>
            <Ionicons name={isSecureText ? "eye-off" : "eye"} size={22} color="#555"/>
        </TouchableOpacity>}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
        );
    }

    const styles = StyleSheet.create({
        wrapper: {
            marginBottom: 10,
        },

        input: {
        flex: 1, 
        paddingHorizontal: 10, 
        paddingVertical: 10,
        },

        inputContainer: {
            backgroundColor: 'lightgray',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: 9,
            borderColor: '#ccc',
            borderWidth: 1,
            paddingLeft: 15,
            paddingRight: 15,
            width: 250,
            marginBottom: 10,
        },

        inputError: {
        borderColor: 'red',
        borderWidth: 1.5,
    },

    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },

}); 