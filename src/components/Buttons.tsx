import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.primary,
        isDisabled ? styles.disabled : null,
        pressed && !isDisabled ? styles.pressed : null,
      ]}
    >
      <View style={styles.row}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        {loading ? (
          <ActivityIndicator color={Colors.background} />
        ) : (
          <Text style={styles.primaryText}>{label}</Text>
        )}
      </View>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  disabled,
  loading,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.secondary,
        isDisabled ? styles.disabledSecondary : null,
        pressed && !isDisabled ? styles.pressed : null,
      ]}
    >
      <View style={styles.row}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        {loading ? (
          <ActivityIndicator color={Colors.text} />
        ) : (
          <Text style={styles.secondaryText}>{label}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  secondary: {
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  icon: {
    marginRight: 10,
  },
  disabled: {
    backgroundColor: '#7AA9FF',
  },
  disabledSecondary: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.9,
  },
});
