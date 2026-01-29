import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { SirenHeader } from '../../components/SirenHeader';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/Buttons';
import { StatusDot } from '../../components/StatusDot';
import { useSiren } from '../../state/SirenContext';
import type { HomeStackParamList } from '../../navigation/HomeStack';

type Props = NativeStackScreenProps<HomeStackParamList, 'DeviceConnection'>;

export function DeviceConnectionScreen({ navigation }: Props) {
  const { pairDevice } = useSiren();

  return (
    <View style={styles.container}>
      <SirenHeader title="Security Device" subtitle="The Siren" />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="bluetooth" size={44} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Connect Your Device</Text>
        <Text style={styles.subtitle}>
          Pair your security device via Bluetooth
        </Text>

        <View style={styles.statusRow}>
          <StatusDot color={Colors.success} />
          <Text style={styles.statusText}>Bluetooth Enabled</Text>
        </View>

        <Card style={styles.deviceCard}>
          <View style={styles.deviceRow}>
            <View style={styles.deviceIcon}>
              <Ionicons name="bluetooth" size={18} color={Colors.primary} />
            </View>
            <View style={styles.deviceMeta}>
              <Text style={styles.deviceName}>Siren</Text>
              <Text style={styles.deviceModel}>Model: SD-2024</Text>
              <View style={styles.deviceStatusRow}>
                <StatusDot color={Colors.success} size={7} />
                <Text style={styles.deviceStatusText}>Available</Text>
              </View>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Pair Device"
          onPress={() => {
            pairDevice();
            navigation.replace('DeviceStatus');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  iconCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.mutedText,
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.mutedText,
  },
  deviceCard: {
    width: '100%',
    marginTop: Spacing.xl,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deviceIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F2F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deviceMeta: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  deviceModel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.mutedText,
  },
  deviceStatusRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceStatusText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedText,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
});
