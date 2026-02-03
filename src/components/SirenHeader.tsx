import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';

type Props = {
  title: string;
  subtitle?: string;
};

export function SirenHeader({ title, subtitle }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, Spacing.lg) },
      ]}
    >
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    color: Colors.text,
    ...(Typography.title as any),
  },
  subtitle: {
    marginTop: 4,
    color: Colors.mutedText,
    ...(Typography.subtitle as any),
  },
});
