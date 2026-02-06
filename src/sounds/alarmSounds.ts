import { NativeModules } from 'react-native';

const { AlarmSoundModule } = NativeModules;

export type AlarmSoundOption = 'Alarm' | 'Siren';

/**
 * Map each option to the filename (without extension) inside ios/Sounds/.
 */
const SOUND_FILES: Record<AlarmSoundOption, string> = {
  Alarm: 'iphone_alarm',
  Siren: 'police_siren',
};

/** Always returns true – the sounds are bundled with the app. */
export function isAlarmSoundAvailable(): boolean {
  return true;
}

/**
 * Play the selected alarm sound at the given volume (0-100).
 * Loops until stopAlarmSound() is called.
 */
export function playAlarmSound(
  option: AlarmSoundOption,
  volumePercent: number,
): void {
  const filename = SOUND_FILES[option];
  AlarmSoundModule.play(filename, volumePercent);
}

/**
 * Stop the currently playing alarm sound.
 */
export function stopAlarmSound(): void {
  AlarmSoundModule.stop();
}
