import { Pressable, StyleSheet, Text } from 'react-native';

export interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function CustomButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
}: CustomButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed && (isPrimary ? styles.primaryPressed : styles.secondaryPressed),
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.title, isPrimary ? styles.primaryTitle : styles.secondaryTitle]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 6,
  },
  primary: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  primaryPressed: {
    backgroundColor: '#333333',
    borderColor: '#333333',
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#111111',
  },
  secondaryPressed: {
    backgroundColor: '#F2F2F2',
  },
  disabled: {
    opacity: 0.6,
  },
  title: {
    flexShrink: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryTitle: {
    color: '#FFFFFF',
  },
  secondaryTitle: {
    color: '#111111',
  },
});