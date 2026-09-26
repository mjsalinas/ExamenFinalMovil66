import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: CustomInputProps) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry ? hidden : false}
        autoCapitalize="none"
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setHidden(!hidden)}
        >
          <Ionicons
            name={hidden ? 'eye-off' : 'eye'}
            size={22}
            color="#472b74"
          />
        </TouchableOpacity>
      )}
    </View>
     );
     }

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#c4b5fd',
    borderRadius: 8,
     paddingHorizontal: 14,
     paddingVertical: 12,
     paddingRight: 44, 
      fontSize: 15,
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
});