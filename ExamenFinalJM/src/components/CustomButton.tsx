import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type ButtomProsp = {
    title: string,
    onPress: ()=>void,
    variant?: 'primary' | 'secondary',
};

export default function CustomButton({title, onPress, variant='primary'}: ButtomProsp){
    const stailes = getStyles(variant);

    return(
        <TouchableOpacity style={stailes.button} onPress={onPress}>
            <Text style={stailes.ButtonTitle}> {title} </Text>
        </TouchableOpacity>
    );

};

const getStyles = (variante: "primary" | "secondary") => {
return StyleSheet.create({
        button:{
            backgroundColor: variante === "primary" ? 'blue' : 'cian',
            borderRadius: variante === "primary" ? 5 : 1,
            width: 150,
            height: 50,
            margin: 10,
            justifyContent: 'center',
        },
        ButtonTitle:{
            color: variante === "primary" ? 'white' : 'black',
            textAlign: 'center',
            fontSize: 20,
        }
    })
}