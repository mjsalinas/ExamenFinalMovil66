import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

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
      activeOpacity={0.8}
    >
      <Text style={isPrimary ? styles.primaryText : styles.secondaryText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primary: {
    backgroundColor: '#4F46E5',
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});