import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type CustomInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  type?: 'email' | 'password' | 'text';
  label?: string;
};

export default function CustomInput({
  value,
  onChangeText,
  placeholder,
  type = 'text',
  label,
}: CustomInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, focused && styles.inputFocused]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        secureTextEntry={type === 'password'}
        keyboardType={type === 'email' ? 'email-address' : 'default'}
        autoCapitalize="none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderCurve: 'continuous',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  inputFocused: {
    borderColor: '#208AEF',
    backgroundColor: '#fff',
    boxShadow: '0 0 0 3px rgba(32, 138, 239, 0.12)',
  },
});
