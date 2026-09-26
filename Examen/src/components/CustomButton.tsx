import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type CustomButtonProps ={
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export default function CustomButton ({title,onPress,variant = 'primary',}: CustomButtonProps){
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[styles.button,isPrimary ? styles.primaryButton : styles.secondaryButton,]} onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  secondaryButton: {
    backgroundColor: '#ba2ba5',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#141515',
  },
});