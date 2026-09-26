import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "secondary" && styles.secondaryButton,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "secondary" && styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#206291",
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: "#c5def0",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryText: {
    color: "#000000",
  },
});
