import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { SirenHeader } from '../../components/SirenHeader';
import { Card } from '../../components/Card';
import { useSiren } from '../../state/SirenContext';
import type { HomeStackParamList } from '../../navigation/HomeStack';

type Props = NativeStackScreenProps<HomeStackParamList, 'DeviceStatus'>;

export function DeviceStatusScreen({ navigation }: Props) {
  const { armed, arm, triggerMotion, motionAlertsEnabled } = useSiren();

  return (
    <View style={styles.container}>
      <SirenHeader title="Security Device" subtitle="The Siren" />

      <View style={styles.content}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (!armed) arm();
          }}
          style={({ pressed }) => [
            styles.center,
            !armed ? styles.tapTarget : null,
            pressed && !armed ? { opacity: 0.9 } : null,
          ]}
        >
          <View
            style={[
              styles.circle,
              armed ? styles.circleArmed : styles.circleDisarmed,
            ]}
          >
            <Ionicons
              name={armed ? 'shield' : 'shield-outline'}
              size={52}
              color={armed ? Colors.background : '#4B5563'}
            />
          </View>

          <Text
            style={[
              styles.state,
              armed ? styles.armedText : styles.disarmedText,
            ]}
          >
            {armed ? 'ARMED' : 'DISARMED'}
          </Text>

          <Text style={styles.stateSubtitle}>
            {armed
              ? 'Device Armed – Motion Detection Active'
              : 'Tap to arm your device'}
          </Text>
        </Pressable>

        {armed ? (
          <Card style={styles.motionCard}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                if (!motionAlertsEnabled) return;
                triggerMotion();
                // Open full-screen modal from the root stack (above tabs)
                const rootNav = navigation.getParent()?.getParent();
                rootNav?.navigate('MotionAlert' as never);
              }}
              style={({ pressed }) => [
                styles.motionRow,
                pressed ? { opacity: 0.85 } : null,
              ]}
            >
              <Ionicons name="pulse" size={18} color={Colors.primary} />
              <Text style={styles.motionText}>Motion Sensing Active</Text>
              <View style={styles.flex1} />
              <Ionicons name="chevron-forward" size={18} color={Colors.gray} />
            </Pressable>
          </Card>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  tapTarget: {
    borderRadius: 20,
  },
  circle: {
    width: 164,
    height: 164,
    borderRadius: 82,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  circleArmed: {
    backgroundColor: Colors.primary,
  },
  circleDisarmed: {
    backgroundColor: '#E5E7EB',
  },
  state: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  armedText: {
    color: Colors.primary,
  },
  disarmedText: {
    color: '#6B7280',
  },
  stateSubtitle: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.mutedText,
    textAlign: 'center',
  },
  motionCard: {
    marginTop: Spacing.xl,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  motionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  motionText: {
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
});
