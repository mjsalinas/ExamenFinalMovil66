import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { KeyboardTypeOptions, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

type CustomInputProps = {
  onChangeText: (text: string) => void;
  value: string;
  placeholder: string;
  secureTextEntry?: boolean;
  type?: "default" | "password" | "email" | "number";
};

export default function CustomInput({
  onChangeText,
  value,
  placeholder,
  secureTextEntry = false,
  type = "default",
}: CustomInputProps) {
  const isPasswordField = secureTextEntry || type === "password";
  const [isSecureText, setIsSecureText] = useState(isPasswordField);

  const iconName: keyof typeof MaterialIcons.glyphMap | undefined =
    isPasswordField ? "lock" : type === "email" ? "alternate-email" : undefined;

  const keyboardType: KeyboardTypeOptions =
    type === "email"
      ? "email-address"
      : type === "number"
        ? "number-pad"
        : "default";

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputContainer}>
        {iconName && <MaterialIcons name={iconName} size={22} color={colors.placeholder} />}
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          keyboardType={keyboardType}
          secureTextEntry={isSecureText}
          autoCapitalize={type === "email" || isPasswordField ? "none" : "sentences"}
          autoCorrect={false}
        />
        {isPasswordField && (
          <TouchableOpacity onPress={() => setIsSecureText(!isSecureText)}>
            <Ionicons name={isSecureText ? "eye" : "eye-off"} size={22} color={colors.placeholder} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
    width: "100%",
  },
  inputContainer: {
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 14,
  },
});
