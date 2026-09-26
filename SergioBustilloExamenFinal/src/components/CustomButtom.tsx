import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type CustomButtonProps = {
    title: string;
    onPress: ()=>void;
    variant?: "primary"| "secondary";
}

export default function CustomButton({title, onPress, variant="primary"}: CustomButtonProps){
    
    const styles = getStyles(variant); 

    return(
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.75} >
            <Text style={styles.buttonTitle}>
                {title}
            </Text>
        </TouchableOpacity >
    );
};

const getStyles = (variant: "primary"| "secondary") =>
    StyleSheet.create({
        button:{
            backgroundColor: variant === "primary" ? '#007AFF' : 
            variant === "secondary" ? '#333333' : '#222222' ,
            borderRadius: variant==="primary"? 10 : variant==="secondary" ? 12 : 10,
            paddingVertical: 14,
            paddingHorizontal: 20,
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
            borderColor: "#444444",
        },
        buttonTitle: {
            fontSize: 16,
            fontWeight: "600",
        }
    });