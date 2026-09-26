import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const CustomButton = ({ title, onPress, variant = 'primary' }: CustomButtonProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.button, variant === 'secondary' ? styles.secondary : styles.primary]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { 
    padding: 15, 
    borderRadius: 8, 
    marginVertical: 8, 
    alignItems: 'center' 
},

  primary: { 
    backgroundColor: '#0f9e3a' 
},

  secondary: { 
    backgroundColor: '#c41e0f' 
},

  text: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
}
});