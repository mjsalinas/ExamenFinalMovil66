import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

export type CustomButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
};

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: CustomButtonProps) {
  const isPrimary = variant === 'primary';
  const isBlocked = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isBlocked}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        isBlocked && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#ffffff' : '#2563eb'} />
      ) : (
        <Text style={isPrimary ? styles.titlePrimary : styles.titleSecondary}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#2563eb',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  titlePrimary: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  titleSecondary: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
});
