import React, { createContext, useContext, useMemo, useState } from 'react';

export type AlarmSoundOption =
  | 'Default Alarm'
  | 'Siren'
  | 'Beep Pattern'
  | 'Alert Tone';

type SirenState = {
  paired: boolean;
  armed: boolean;
  motionDetectedAt: Date | null;

  alarmSound: AlarmSoundOption;
  volume: number; // 0-100
  motionAlertsEnabled: boolean;

  pairDevice: () => void;
  arm: () => void;
  disarm: () => void;
  triggerMotion: (at?: Date) => void;
  clearMotion: () => void;

  setAlarmSound: (v: AlarmSoundOption) => void;
  setVolume: (v: number) => void;
  setMotionAlertsEnabled: (v: boolean) => void;
};

const SirenContext = createContext<SirenState | null>(null);

export function SirenProvider({ children }: { children: React.ReactNode }) {
  const [paired, setPaired] = useState(false);
  const [armed, setArmed] = useState(false);
  const [motionDetectedAt, setMotionDetectedAt] = useState<Date | null>(null);

  const [alarmSound, setAlarmSound] =
    useState<AlarmSoundOption>('Default Alarm');
  const [volume, setVolume] = useState<number>(75);
  const [motionAlertsEnabled, setMotionAlertsEnabled] = useState<boolean>(true);

  const value = useMemo<SirenState>(
    () => ({
      paired,
      armed,
      motionDetectedAt,
      alarmSound,
      volume,
      motionAlertsEnabled,

      pairDevice: () => setPaired(true),
      arm: () => setArmed(true),
      disarm: () => setArmed(false),
      triggerMotion: (at?: Date) => setMotionDetectedAt(at ?? new Date()),
      clearMotion: () => setMotionDetectedAt(null),

      setAlarmSound,
      setVolume: (v: number) =>
        setVolume(Math.max(0, Math.min(100, Math.round(v)))),
      setMotionAlertsEnabled,
    }),
    [paired, armed, motionDetectedAt, alarmSound, volume, motionAlertsEnabled],
  );

  return (
    <SirenContext.Provider value={value}>{children}</SirenContext.Provider>
  );
}

export function useSiren() {
  const ctx = useContext(SirenContext);
  if (!ctx) {
    throw new Error('useSiren must be used within SirenProvider');
  }
  return ctx;
}
