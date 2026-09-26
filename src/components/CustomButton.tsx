import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  }

 export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
   }: CustomButtonProps) {
  const isPrimary = variant === 'primary';
    return (
    <TouchableOpacity
          style={[styles.button, isPrimary ? styles.primary : styles.secondary]}
        onPress={onPress}
    >
      <Text style={isPrimary ? styles.textPrimary : styles.textSecondary}>
        {title}
      </Text>
    </TouchableOpacity>
  );
    }

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primary: {
    backgroundColor: '#3a1f69',
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3a1f69',
  },
  textPrimary: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  textSecondary: {
    color: '#3a1f69',
    fontWeight: '600',
    fontSize: 15,
  },
});