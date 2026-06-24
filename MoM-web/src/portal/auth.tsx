// Auth/login foundation for the Multiverse of Madness portal.
// Ported faithfully from the legacy Angular login.ts + permissions.service.ts.
// Keeps: hardcoded fallback admins, best-effort non-blocking Firebase sync of
// system/admins + system/config, attempts/maxAttempts(10)/lockout persisted to
// localStorage 'mom_config_cache', session persisted to sessionStorage 'mom_user'.
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ref, set, onValue, off, type DatabaseReference } from 'firebase/database';
// Portal-only icon font: imported here (the portal's root provider) so it stays in
// the lazy portal chunk instead of loading on the public landing.
import '@fortawesome/fontawesome-free/css/all.min.css';
import { db } from './firebase';
import type { AdminCredential, AdminLevel, AdminSession } from './types';

const FIREBASE_ADMINS_PATH = 'system/admins';
const FIREBASE_CONFIG_PATH = 'system/config';
const LOCAL_CACHE_KEY = 'mom_config_cache';
const SESSION_KEY = 'mom_user';
const DEFAULT_MAX_ATTEMPTS = 10;

interface SystemConfig {
  maxAttempts: number;
  locked: boolean;
  currentAttempts: number;
  lastAttempt?: string;
}

// Hardcoded fallback admins (same as legacy login.ts constructor). Single
// source of truth — the Firebase seed map below is derived from this list.
const FALLBACK_ADMINS: AdminCredential[] = [
  { uuid: 'ADM-001-PRIME', username: 'admin001', password: 'dimension2024', name: 'Super Admin', active: true, level: 3 },
  { uuid: 'ADM-002-DELTA', username: 'admin002', password: 'madness2024', name: 'Manager', active: true, level: 2 },
  { uuid: 'ADM-003-GAMMA', username: 'admin003', password: 'quantum2024', name: 'Viewer', active: true, level: 1 },
  { uuid: 'ROOT-SYS-0000', username: 'root', password: 'momadmin', name: 'Root Administrator', active: true, level: 3 },
];

// Default admin set written to Firebase when system/admins is empty (keyed by username).
const DEFAULT_ADMINS_MAP: Record<string, AdminCredential> = Object.fromEntries(
  FALLBACK_ADMINS.map((admin) => [admin.username, admin]),
);

const LOGIN_ERROR_MESSAGES = [
  'ACCESO DENEGADO - Credenciales inválidas',
  'FALLO DE AUTENTICACIÓN - Verifique su ID',
  'IDENTIDAD NO RECONOCIDA - Acceso rechazado',
  'ALERTA DE SEGURIDAD - Intento no autorizado registrado',
];

function generateUUID(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `USR-${timestamp}-${random}`;
}

interface AuthContextValue {
  session: AdminSession | null;
  level: AdminLevel;
  login(username: string, password: string): Promise<{ ok: boolean; message: string }>;
  logout(): void;
  attemptsRemaining: number;
  maxAttempts: number;
  locked: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadSessionFromStorage(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as AdminSession;
  } catch {
    // ignore corrupt session
  }
  return null;
}

function loadConfigFromCache(): { maxAttempts: number; failedAttempts: number; locked: boolean } {
  try {
    const cached = localStorage.getItem(LOCAL_CACHE_KEY);
    if (cached) {
      const config = JSON.parse(cached) as Partial<SystemConfig>;
      return {
        maxAttempts: config.maxAttempts || DEFAULT_MAX_ATTEMPTS,
        failedAttempts: config.currentAttempts || 0,
        locked: config.locked || false,
      };
    }
  } catch {
    // fall through to defaults
  }
  return { maxAttempts: DEFAULT_MAX_ATTEMPTS, failedAttempts: 0, locked: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => loadSessionFromStorage());

  const initial = loadConfigFromCache();
  const [maxAttempts, setMaxAttempts] = useState<number>(initial.maxAttempts);
  const [failedAttempts, setFailedAttempts] = useState<number>(initial.failedAttempts);
  const [locked, setLocked] = useState<boolean>(initial.locked);

  // Admins start as fallback for immediate login; Firebase sync overwrites later.
  const adminsRef = useRef<AdminCredential[]>(FALLBACK_ADMINS);

  // Background (non-blocking) Firebase sync of system/config and system/admins.
  useEffect(() => {
    const configRef: DatabaseReference = ref(db, FIREBASE_CONFIG_PATH);
    const adminsDbRef: DatabaseReference = ref(db, FIREBASE_ADMINS_PATH);

    onValue(
      configRef,
      (snapshot) => {
        const data = snapshot.val() as SystemConfig | null;
        if (data) {
          setMaxAttempts(data.maxAttempts || DEFAULT_MAX_ATTEMPTS);
          setFailedAttempts(data.currentAttempts || 0);
          setLocked(data.locked || false);
          try {
            localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
          } catch {
            // ignore storage failures
          }
        } else {
          // Initialize Firebase config (best-effort, non-blocking).
          const config: SystemConfig = { maxAttempts: DEFAULT_MAX_ATTEMPTS, locked: false, currentAttempts: 0 };
          set(configRef, config).catch((e) => console.error('Init config error:', e));
          try {
            localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(config));
          } catch {
            // ignore
          }
        }
      },
      (error) => {
        console.error('Firebase config error:', error);
      },
    );

    onValue(
      adminsDbRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          adminsRef.current = (Object.values(data) as Array<Partial<AdminCredential>>)
            .filter((a) => a.active !== false)
            .map((a) => ({
              ...a,
              uuid: a.uuid || `LEGACY-${a.username?.toUpperCase() || 'UNKNOWN'}`,
              level: (a.level || 3) as AdminLevel,
            })) as AdminCredential[];
        } else {
          // Seed default admins (best-effort, non-blocking).
          set(adminsDbRef, DEFAULT_ADMINS_MAP)
            .then(() => {
              adminsRef.current = Object.values(DEFAULT_ADMINS_MAP);
            })
            .catch((e) => console.error('Init admins error:', e));
        }
      },
      (error) => {
        console.error('Firebase admins error:', error);
        adminsRef.current = FALLBACK_ADMINS;
      },
    );

    return () => {
      off(configRef);
      off(adminsDbRef);
    };
  }, []);

  function persistConfig(nextFailed: number, nextLocked: boolean): void {
    const config: SystemConfig = {
      maxAttempts,
      locked: nextLocked,
      currentAttempts: nextFailed,
      lastAttempt: new Date().toISOString(),
    };
    // Local cache first for instant load.
    try {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(config));
    } catch {
      // ignore storage failures
    }
    // Firebase in background with a 2s timeout so a slow write never blocks.
    const savePromise = set(ref(db, FIREBASE_CONFIG_PATH), config);
    const timeoutPromise = new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error('Firebase save timeout')), 2000),
    );
    Promise.race([savePromise, timeoutPromise]).catch((e: unknown) => {
      console.warn('Save config warning:', e instanceof Error ? e.message : e);
    });
  }

  async function login(username: string, password: string): Promise<{ ok: boolean; message: string }> {
    const remaining = maxAttempts - failedAttempts;

    if (locked || remaining <= 0) {
      setLocked(true);
      return { ok: false, message: 'BLOQUEO DEL SISTEMA - No quedan tokens de seguridad' };
    }

    const normalizedUser = username.toLowerCase().trim();

    const validUser = adminsRef.current.find(
      (admin) => admin.username.toLowerCase() === normalizedUser && admin.password === password,
    );

    if (validUser) {
      const newSession: AdminSession = {
        uuid: validUser.uuid || generateUUID(),
        username: validUser.username,
        name: validUser.name,
        role: 'admin',
        level: (validUser.level || 1) as AdminLevel,
        loginTime: new Date().toISOString(),
      };
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      } catch {
        // ignore storage failures
      }
      setSession(newSession);
      return { ok: true, message: '' };
    }

    const nextFailed = failedAttempts + 1;
    const nextLocked = nextFailed >= maxAttempts;
    setFailedAttempts(nextFailed);
    if (nextLocked) setLocked(true);
    persistConfig(nextFailed, nextLocked);

    const message = nextLocked
      ? 'BLOQUEO DEL SISTEMA - Máximo de intentos excedido'
      : LOGIN_ERROR_MESSAGES[Math.floor(Math.random() * LOGIN_ERROR_MESSAGES.length)];

    return { ok: false, message };
  }

  function logout(): void {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore storage failures
    }
    setSession(null);
  }

  const attemptsRemaining = Math.max(0, maxAttempts - failedAttempts);
  const level: AdminLevel = session?.level ?? 1;

  const value: AuthContextValue = {
    session,
    level,
    login,
    logout,
    attemptsRemaining,
    maxAttempts,
    locked,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
