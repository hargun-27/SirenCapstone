import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';
import { Shadows } from '../theme/shadows';

type Props = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export function Card({ style, children }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    ...(Shadows.card as any),
  },
});
