import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { SirenHeader } from '../../components/SirenHeader';
import { Card } from '../../components/Card';
import { SecondaryButton } from '../../components/Buttons';
import { useSiren } from '../../state/SirenContext';
import type { HomeStackParamList } from '../../navigation/HomeStack';

type Props = NativeStackScreenProps<HomeStackParamList, 'DeviceStatus'>;

export function DeviceStatusScreen(_props: Props) {
  const { armed, arm, disarm, isLoading, error } = useSiren();
  const [isArming, setIsArming] = useState(false);
  const [isDisarming, setIsDisarming] = useState(false);

  const handleArm = async () => {
    if (armed || isArming) return;
    try {
      setIsArming(true);
      await arm();
    } catch {
      // Error is handled in context
    } finally {
      setIsArming(false);
    }
  };

  const handleDisarm = async () => {
    if (!armed || isDisarming) return;
    try {
      setIsDisarming(true);
      await disarm();
    } catch {
      // Error is handled in context
    } finally {
      setIsDisarming(false);
    }
  };

  return (
    <View style={styles.container}>
      <SirenHeader title="Security Device" subtitle="The Siren" />

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.content}>
        <Pressable
          accessibilityRole="button"
          onPress={handleArm}
          disabled={isArming || isLoading}
          style={({ pressed }) => [
            styles.center,
            !armed ? styles.tapTarget : null,
            pressed && !armed && !isArming ? { opacity: 0.9 } : null,
            isArming || isLoading ? { opacity: 0.6 } : null,
          ]}
        >
          <View
            style={[
              styles.circle,
              armed ? styles.circleArmed : styles.circleDisarmed,
            ]}
          >
            {isArming ? (
              <ActivityIndicator
                size="large"
                color={armed ? Colors.background : Colors.primary}
              />
            ) : (
              <Ionicons
                name={armed ? 'shield' : 'shield-outline'}
                size={52}
                color={armed ? Colors.background : '#4B5563'}
              />
            )}
          </View>

          <Text
            style={[
              styles.state,
              armed ? styles.armedText : styles.disarmedText,
            ]}
          >
            {isArming ? 'ARMING...' : armed ? 'ARMED' : 'DISARMED'}
          </Text>

          <Text style={styles.stateSubtitle}>
            {isArming
              ? 'Connecting to device...'
              : armed
              ? 'Device Armed – Motion Detection Active'
              : 'Tap to arm your device'}
          </Text>
        </Pressable>

        {armed ? (
          <>
            <Card style={styles.motionCard}>
              <View style={styles.motionRow}>
                <Ionicons name="pulse" size={18} color={Colors.primary} />
                <Text style={styles.motionText}>Motion Sensing Active</Text>
              </View>
            </Card>

            <View style={styles.disarmButtonContainer}>
              <SecondaryButton
                label={isDisarming ? 'Disarming...' : 'Disarm Siren'}
                onPress={handleDisarm}
                disabled={isDisarming || isLoading}
                loading={isDisarming}
              />
            </View>
          </>
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
  disarmButtonContainer: {
    marginTop: Spacing.lg,
    width: '100%',
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
  errorContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: '#FFEAEA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.alert,
  },
  errorText: {
    color: Colors.alert,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
