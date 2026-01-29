import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  color: string;
  size?: number;
};

export function StatusDot({ color, size = 8 }: Props) {
  return (
    <View
      style={[
        styles.dot,
        { backgroundColor: color, width: size, height: size },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: 999,
  },
});
