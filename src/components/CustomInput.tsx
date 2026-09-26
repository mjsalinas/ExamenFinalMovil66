import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

export interface CustomInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
}

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType,
}: CustomInputProps) {
  return (
    <TextInput
      accessibilityLabel={placeholder}
      autoCapitalize="none"
      keyboardType={keyboardType}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#777777"
      secureTextEntry={secureTextEntry}
      selectionColor="#111111"
      style={styles.input}
      value={value}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    color: '#111111',
    fontSize: 16,
  },
});