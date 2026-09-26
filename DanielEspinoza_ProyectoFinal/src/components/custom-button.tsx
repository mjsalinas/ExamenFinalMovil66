import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

type Variant = "primary" | "secondary" | "tertiary";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
};

const variantColors: Record<Variant, { background: string; text: string; border: string }> = {
  primary: { background: colors.primary, text: colors.onPrimary, border: colors.primary },
  secondary: { background: colors.secondary, text: colors.onSecondary, border: colors.border },
  tertiary: { background: colors.tertiary, text: colors.onTertiary, border: colors.tertiary },
};

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}: CustomButtonProps) {
  const styles = getStyles(variant);
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={styles.buttonTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const getStyles = (variant: Variant) =>
  StyleSheet.create({
    button: {
      backgroundColor: variantColors[variant].background,
      borderColor: variantColors[variant].border,
      borderWidth: 1,
      borderRadius: 12,
      width: "100%",
      paddingVertical: 14,
      marginBottom: 12,
    },
    disabled: {
      opacity: 0.6,
    },
    buttonTitle: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 16,
      color: variantColors[variant].text,
    },
  });
