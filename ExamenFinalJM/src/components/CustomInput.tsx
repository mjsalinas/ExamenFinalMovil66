import React from "react";
import { View, TextInput, StyleSheet } from "react-native";


type InputProps = {
    PlaceHolder: string,
    value: string,
    onChangeText: (text: string) => void,
    secureTextEntry?: boolean,
};

export default function CustomInput({PlaceHolder, value, onChangeText, secureTextEntry=false}: InputProps){
    return(
        <View style={styles.wram}>
            <View style={styles.continerInput}>
                <TextInput 
                    value={value} 
                    placeholder={PlaceHolder} 
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wram:{
        marginBottom: 10,
    },
    
    continerInput:{
            backgroundColor: 'lightgray',
            alignItems: 'center',
            justifyContent: "space-between",
            borderRadius: 9,
            borderColor: "gray",
            borderWidth: 1,
            paddingLeft: 20,
            paddingRight: 20,
    }
})

