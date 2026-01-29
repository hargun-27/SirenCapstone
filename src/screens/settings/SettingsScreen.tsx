import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Slider from '@react-native-community/slider';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { SirenHeader } from '../../components/SirenHeader';
import { Card } from '../../components/Card';
import { PrimaryButton, SecondaryButton } from '../../components/Buttons';
import { useSiren, type AlarmSoundOption } from '../../state/SirenContext';

const SOUND_OPTIONS: AlarmSoundOption[] = [
  'Default Alarm',
  'Siren',
  'Beep Pattern',
  'Alert Tone',
];

export function SettingsScreen() {
  const {
    alarmSound,
    setAlarmSound,
    volume,
    setVolume,
    motionAlertsEnabled,
    setMotionAlertsEnabled,
  } = useSiren();

  const [soundModalVisible, setSoundModalVisible] = useState(false);

  const volumeLabel = useMemo(() => `${volume}%`, [volume]);

  return (
    <View style={styles.container}>
      <SirenHeader
        title="Settings"
        subtitle="Configure your device preferences"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="volume-high-outline" size={18} color={Colors.text} />
          <Text style={styles.sectionTitle}>Alarm Settings</Text>
        </View>

        <Card style={styles.sectionCard}>
          <Text style={styles.fieldLabel}>Alarm Sound</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setSoundModalVisible(true)}
            style={styles.select}
          >
            <Text style={[styles.selectText, { color: Colors.primary }]}>
              {alarmSound}
            </Text>
            <Ionicons name="chevron-down" size={18} color={Colors.gray} />
          </Pressable>

          <View style={{ height: Spacing.md }} />

          <SecondaryButton
            label="Upload Custom Sound"
            onPress={() => {
              // TODO: wire file picker / audio import
            }}
            icon={
              <Ionicons
                name="cloud-upload-outline"
                size={18}
                color={Colors.text}
              />
            }
          />

          <View style={{ height: Spacing.lg }} />

          <View style={styles.sliderRow}>
            <Text style={styles.fieldLabel}>Volume</Text>
            <Text style={styles.volumeValue}>{volumeLabel}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={volume}
            onValueChange={setVolume}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={'#D7DCE6'}
            thumbTintColor={Colors.primary}
          />

          <View style={{ height: Spacing.md }} />

          <SecondaryButton
            label="Test Alarm"
            onPress={() => {
              // TODO: play selected alarm sound
            }}
            icon={
              <Ionicons
                name="play-circle-outline"
                size={20}
                color={Colors.text}
              />
            }
          />
        </Card>

        <View style={{ height: Spacing.xl }} />

        <View style={styles.sectionHeader}>
          <Ionicons
            name="notifications-outline"
            size={18}
            color={Colors.text}
          />
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>

        <Card style={styles.sectionCard}>
          <View style={styles.toggleRow}>
            <View style={styles.flex1}>
              <Text style={styles.toggleTitle}>Motion Alerts</Text>
              <Text style={styles.toggleSubtitle}>
                Send alert when motion is detected
              </Text>
            </View>
            <Switch
              value={motionAlertsEnabled}
              onValueChange={setMotionAlertsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#9CC2FF' }}
              thumbColor={motionAlertsEnabled ? Colors.primary : '#F3F4F6'}
            />
          </View>
        </Card>
      </ScrollView>

      <Modal
        visible={soundModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSoundModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSoundModalVisible(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <Text style={styles.modalTitle}>Alarm Sound</Text>
            {SOUND_OPTIONS.map(option => {
              const selected = option === alarmSound;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  onPress={() => {
                    setAlarmSound(option);
                    setSoundModalVisible(false);
                  }}
                  style={styles.modalOption}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selected ? { color: Colors.primary } : null,
                    ]}
                  >
                    {option}
                  </Text>
                  {selected ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={Colors.primary}
                    />
                  ) : null}
                </Pressable>
              );
            })}

            <View style={{ height: Spacing.sm }} />
            <PrimaryButton
              label="Done"
              onPress={() => setSoundModalVisible(false)}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  sectionCard: {
    padding: Spacing.lg,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mutedText,
  },
  select: {
    marginTop: 10,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7FAFF',
  },
  selectText: {
    fontSize: 13,
    fontWeight: '800',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  volumeValue: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.mutedText,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  toggleSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.mutedText,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: Spacing.lg,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  modalOption: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOptionText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
  },
});
