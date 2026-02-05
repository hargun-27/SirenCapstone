import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  getLockState,
  lockDevice,
  unlockDevice,
  triggerLock,
  untriggerLock,
} from '../api/lockApi';
import type { AlarmSoundOption } from '../sounds/alarmSounds';

export type { AlarmSoundOption };

type SirenState = {
  paired: boolean;
  armed: boolean;
  motionDetectedAt: Date | null;

  alarmSound: AlarmSoundOption;
  volume: number; // 0-100
  motionAlertsEnabled: boolean;

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  pairDevice: () => void;
  arm: () => Promise<void>;
  disarm: () => Promise<void>;
  /** Disarm and clear trigger in one flow; uses unlock response for state so UI shows disarmed. */
  disarmAndClearMotion: () => Promise<void>;
  triggerMotion: () => Promise<void>;
  clearMotion: () => Promise<void>;
  refreshState: () => Promise<void>;

  setAlarmSound: (v: AlarmSoundOption) => void;
  setVolume: (v: number) => void;
  setMotionAlertsEnabled: (v: boolean) => void;
};

const SirenContext = createContext<SirenState | null>(null);

export function SirenProvider({ children }: { children: React.ReactNode }) {
  const [paired, setPaired] = useState(false);
  const [armed, setArmed] = useState(false);
  const [motionDetectedAt, setMotionDetectedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [alarmSound, setAlarmSound] = useState<AlarmSoundOption>('Alarm');
  const [volume, setVolume] = useState<number>(75);
  const [motionAlertsEnabled, setMotionAlertsEnabled] = useState<boolean>(true);

  // Last API state we applied — only update UI when fetch result actually changes
  const lastApiStateRef = useRef<{
    is_locked: boolean;
    is_triggered: boolean;
  } | null>(null);

  // Sync API state to app state only when it differs from what we last applied
  const syncStateFromApi = useCallback(
    (apiState: { is_locked: boolean; is_triggered: boolean }) => {
      const prev = lastApiStateRef.current;
      const isDifferent =
        !prev ||
        prev.is_locked !== apiState.is_locked ||
        prev.is_triggered !== apiState.is_triggered;

      if (isDifferent) {
        lastApiStateRef.current = apiState;
        setArmed(apiState.is_locked);
        setMotionDetectedAt(apiState.is_triggered ? new Date() : null);
      }
    },
    [],
  );

  // Fetch lock state; only update UI when response is different from last applied
  const refreshState = useCallback(async () => {
    if (!paired) return;

    try {
      setError(null);
      const state = await getLockState();
      syncStateFromApi(state);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch lock state';
      setError(errorMessage);
      console.error('Error fetching lock state:', err);
    }
  }, [paired, syncStateFromApi]);

  // Poll backend every 5 seconds when paired
  useEffect(() => {
    if (!paired) return;

    refreshState();
    const interval = setInterval(refreshState, 5000);
    return () => clearInterval(interval);
  }, [paired, refreshState]);

  const arm = useCallback(async () => {
    if (!paired) return;

    try {
      setIsLoading(true);
      setError(null);
      const state = await lockDevice();
      syncStateFromApi(state);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to arm device';
      setError(errorMessage);
      console.error('Error arming device:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [paired, syncStateFromApi]);

  const disarm = useCallback(async () => {
    if (!paired) return;

    try {
      setIsLoading(true);
      setError(null);
      const state = await unlockDevice();
      syncStateFromApi(state);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to disarm device';
      setError(errorMessage);
      console.error('Error disarming device:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [paired, syncStateFromApi]);

  const triggerMotion = useCallback(async () => {
    if (!paired) return;

    try {
      setIsLoading(true);
      setError(null);
      const state = await triggerLock();
      syncStateFromApi(state);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to trigger motion';
      setError(errorMessage);
      console.error('Error triggering motion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [paired, syncStateFromApi]);

  const clearMotion = useCallback(async () => {
    if (!paired) return;

    try {
      setIsLoading(true);
      setError(null);
      const state = await untriggerLock();
      syncStateFromApi(state);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to clear motion';
      setError(errorMessage);
      console.error('Error clearing motion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [paired, syncStateFromApi]);

  // Disarm + clear trigger in one flow. Call unlock then untrigger; apply state
  // from unlock so UI shows disarmed (untrigger can return is_locked: true).
  const disarmAndClearMotion = useCallback(async () => {
    if (!paired) return;

    try {
      setIsLoading(true);
      setError(null);
      const unlockState = await unlockDevice();
      await untriggerLock();
      // Use unlock response so we show disarmed; untrigger may return is_locked: true
      syncStateFromApi({
        is_locked: unlockState.is_locked,
        is_triggered: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to disarm device';
      setError(errorMessage);
      console.error('Error disarming device:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [paired, syncStateFromApi]);

  const value = useMemo<SirenState>(
    () => ({
      paired,
      armed,
      motionDetectedAt,
      alarmSound,
      volume,
      motionAlertsEnabled,
      isLoading,
      error,

      pairDevice: () => setPaired(true),
      arm,
      disarm,
      disarmAndClearMotion,
      triggerMotion,
      clearMotion,
      refreshState,

      setAlarmSound,
      setVolume: (v: number) =>
        setVolume(Math.max(0, Math.min(100, Math.round(v)))),
      setMotionAlertsEnabled,
    }),
    [
      paired,
      armed,
      motionDetectedAt,
      alarmSound,
      volume,
      motionAlertsEnabled,
      isLoading,
      error,
      arm,
      disarm,
      disarmAndClearMotion,
      triggerMotion,
      clearMotion,
      refreshState,
    ],
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
