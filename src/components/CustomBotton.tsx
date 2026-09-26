import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type CustomButtonProps = {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" ; 
}

export default function CustomButton({title, onPress, variant='primary'}: CustomButtonProps) {
    
    const getBackground = (): string => {
        if (variant === 'primary')   return '#007AFF'; 
        if (variant === 'secondary') return '#FFFFFF'; 
        return 'transparent';          
    };

    const getTextColor = (): string => {
        if (variant === 'primary')   return '#FFFFFF';
        if (variant === 'secondary') return '#333333';
        return '#007AFF';          
    };

    return (
        <TouchableOpacity
            style={[styles.base, { backgroundColor: getBackground() }]}
            onPress={onPress}
            activeOpacity={0.75} 
        >
            <Text style={[styles.label, { color: getTextColor() }]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: 10,       
        paddingVertical: 14,    
        paddingHorizontal: 24,  
        marginVertical: 6,
        alignItems: 'center',
        width: '100%',
    },
    label: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        textAlign: 'center'
    },
});