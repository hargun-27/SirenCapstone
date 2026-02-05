/**
 * Alarm sound stub — no native audio library is currently installed.
 * All functions are no-ops so the rest of the app works without crashing.
 * Replace this with a real implementation once an RN 0.83-compatible
 * audio library is available.
 */

export type AlarmSoundOption = 'Alarm' | 'Siren';

/** Always returns false — no audio library installed. */
export function isAlarmSoundAvailable(): boolean {
  return false;
}

/** No-op — no audio library installed. */
export function playAlarmSound(
  _option: AlarmSoundOption,
  _volumePercent: number,
): void {
  console.warn('[alarmSounds] No audio library installed — sound not played.');
}

/** No-op — resolves immediately. */
export function stopAlarmSound(): Promise<void> {
  return Promise.resolve();
}
