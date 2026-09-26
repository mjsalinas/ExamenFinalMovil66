import React from "react";
import { View, TextInput } from "react-native";


type InputProps = {
    PlaceHolder: string,
    value: string,
    onChangeText: (text: string) => void,
    secureTextEntry: boolean,
};

export default function CustomInput({PlaceHolder, value, onChangeText, secureTextEntry=false}: InputProps){
    return(
        <View>
            <View>
                <TextInput 
                    value={value} placeholder={PlaceHolder} onChange={onChangeText} />
            </View>
        </View>
    );
};

