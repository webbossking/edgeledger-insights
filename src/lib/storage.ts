const STORAGE_VERSION = 1;

const KEYS = {
  session: 'edgel_session',
  profile: 'edgel_profile',
  settings: 'edgel_settings',
  bankrollPlan: 'edgel_bankroll_plan',
  betLogs: 'edgel_bet_logs',
  savedPicks: 'edgel_saved_picks',
  adminPicks: 'edgel_admin_picks',
  sourceStatus: 'edgel_source_status',
  version: 'edgel_version',
} as const;

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed', e);
  }
}

function remove(key: string): void {
  localStorage.removeItem(key);
}

export const storage = {
  KEYS,
  get: safeGet,
  set: safeSet,
  remove,

  getSession: () => safeGet<{ phone: string; authenticated: boolean } | null>(KEYS.session, null),
  setSession: (s: { phone: string; authenticated: boolean } | null) => safeSet(KEYS.session, s),

  getProfile: () => safeGet<Record<string, unknown> | null>(KEYS.profile, null),
  setProfile: (p: Record<string, unknown>) => safeSet(KEYS.profile, p),

  getSettings: () => safeGet<Record<string, unknown>>(KEYS.settings, {}),
  setSettings: (s: Record<string, unknown>) => safeSet(KEYS.settings, s),

  getBankrollPlan: () => safeGet<{ startingBankroll: number; currentBankroll: number; unitSize: number; maxDailyExposure: number; weeklyLossLimit: number; } | null>(KEYS.bankrollPlan, null),
  setBankrollPlan: (b: unknown) => safeSet(KEYS.bankrollPlan, b),

  getBetLogs: () => safeGet<unknown[]>(KEYS.betLogs, []),
  setBetLogs: (b: unknown[]) => safeSet(KEYS.betLogs, b),

  getSavedPicks: () => safeGet<string[]>(KEYS.savedPicks, []),
  setSavedPicks: (p: string[]) => safeSet(KEYS.savedPicks, p),

  getAdminPicks: () => safeGet<unknown[]>(KEYS.adminPicks, []),
  setAdminPicks: (p: unknown[]) => safeSet(KEYS.adminPicks, p),

  getSourceStatus: () => safeGet<Record<string, unknown> | null>(KEYS.sourceStatus, null),
  setSourceStatus: (s: Record<string, unknown>) => safeSet(KEYS.sourceStatus, s),

  clearAll: () => {
    Object.values(KEYS).forEach(k => remove(k));
  },
};
