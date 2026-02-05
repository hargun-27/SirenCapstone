import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Card } from '../../components/Card';
import { PrimaryButton, SecondaryButton } from '../../components/Buttons';
import { useSiren } from '../../state/SirenContext';
import { playAlarmSound, stopAlarmSound } from '../../sounds/alarmSounds';
import type { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'MotionAlert'>;

function formatTime(d: Date) {
  return d.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function MotionAlertScreen({ navigation }: Props) {
  const {
    motionDetectedAt,
    alarmSound,
    volume,
    motionAlertsEnabled,
    clearMotion,
    disarmAndClearMotion,
  } = useSiren();
  const [isDisarming, setIsDisarming] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  // Play alarm when motion alert is shown (if alerts enabled)
  useEffect(() => {
    if (motionDetectedAt && motionAlertsEnabled) {
      playAlarmSound(alarmSound, volume);
    }
    return () => {
      stopAlarmSound();
    };
  }, [motionDetectedAt, motionAlertsEnabled, alarmSound, volume]);

  const timestamp = useMemo(() => {
    if (!motionDetectedAt) return '';
    return formatTime(motionDetectedAt);
  }, [motionDetectedAt]);

  const handleDisarm = async () => {
    if (isDisarming || isDismissing) return;
    try {
      setIsDisarming(true);
      await stopAlarmSound();
      await disarmAndClearMotion();
      navigation.goBack();
    } catch {
      // Error is handled in context
    } finally {
      setIsDisarming(false);
    }
  };

  const handleDismiss = async () => {
    if (isDisarming || isDismissing) return;
    try {
      setIsDismissing(true);
      await stopAlarmSound();
      await clearMotion();
      navigation.goBack();
    } catch {
      // Error is handled in context
    } finally {
      setIsDismissing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraPlaceholder} />

      <View style={styles.banner}>
        <Ionicons name="warning-outline" size={18} color={Colors.background} />
        <Text style={styles.bannerText}>MOTION DETECTED</Text>
        <Ionicons name="warning-outline" size={18} color={Colors.background} />
      </View>

      <View style={styles.overlay}>
        <Card style={styles.card}>
          <Text style={styles.title}>Attention Required</Text>
          <Text style={styles.description}>
            Your device has detected movement. Please verify that this is
            expected activity.
          </Text>

          <View style={styles.warningCircle}>
            <Ionicons name="warning" size={28} color={Colors.alert} />
          </View>

          <Text style={styles.timestamp}>{timestamp}</Text>

          <View style={{ height: Spacing.lg }} />

          <PrimaryButton
            label={isDisarming ? 'Disarming...' : 'Disarm Device'}
            onPress={handleDisarm}
            disabled={isDisarming || isDismissing}
            loading={isDisarming}
            icon={
              !isDisarming ? (
                <Ionicons
                  name="lock-open-outline"
                  size={18}
                  color={Colors.background}
                />
              ) : undefined
            }
          />

          <View style={{ height: Spacing.md }} />

          <SecondaryButton
            label={isDismissing ? 'Dismissing...' : 'Dismiss'}
            onPress={handleDismiss}
            disabled={isDisarming || isDismissing}
            loading={isDismissing}
          />
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  cameraPlaceholder: {
    height: '45%',
    backgroundColor: Colors.black,
  },
  banner: {
    height: 52,
    backgroundColor: Colors.alert,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  bannerText: {
    color: Colors.background,
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 13,
  },
  overlay: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: '#F7F8FB',
  },
  card: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text,
    textAlign: 'center',
  },
  description: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.mutedText,
    textAlign: 'center',
    lineHeight: 18,
  },
  warningCircle: {
    marginTop: Spacing.lg,
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timestamp: {
    marginTop: Spacing.md,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedText,
  },
});
