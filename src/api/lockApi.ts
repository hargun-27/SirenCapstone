/**
 * Lockedin API – backend: https://github.com/mat-ng/lockedin
 * Deployed at: https://lockedin-gn7w.onrender.com
 * GET /lock (get state), POST /lock, /unlock, /trigger, /untrigger
 */
const API_BASE_URL = 'https://lockedin-gn7w.onrender.com';

export type LockState = {
  id: number;
  is_locked: boolean;
  is_triggered: boolean;
};

/**
 * Get the current lock state from the API
 */
export async function getLockState(): Promise<LockState> {
  const response = await fetch(`${API_BASE_URL}/lock`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get lock state: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Lock the device (arm)
 */
export async function lockDevice(): Promise<LockState> {
  const response = await fetch(`${API_BASE_URL}/lock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to lock device: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Unlock the device (disarm)
 */
export async function unlockDevice(): Promise<LockState> {
  const response = await fetch(`${API_BASE_URL}/unlock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to unlock device: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Trigger the lock (motion detected)
 */
export async function triggerLock(): Promise<LockState> {
  const response = await fetch(`${API_BASE_URL}/trigger`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to trigger lock: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Untrigger the lock (clear motion)
 */
export async function untriggerLock(): Promise<LockState> {
  const response = await fetch(`${API_BASE_URL}/untrigger`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to untrigger lock: ${response.statusText}`);
  }

  return response.json();
}
