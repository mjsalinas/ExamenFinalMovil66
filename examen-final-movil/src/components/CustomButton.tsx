import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secundary';
  disabled?: boolean;
  loading?: boolean;
};

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: CustomButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secundary,
        isDisabled && styles.disabled,
        pressed && !isDisabled && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : '#208AEF'} />
      ) : (
        <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textsecundary]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingVertical: 14,
  },
  primary: {
    backgroundColor: '#208AEF',
    boxShadow: '0 4px 12px rgba(32, 138, 239, 0.35)',
  },
  secundary: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
  textPrimary: {
    color: '#fff',
  },
  textsecundary: {
    color: '#208AEF',
  },
});
