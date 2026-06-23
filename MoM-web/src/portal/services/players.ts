// Players data service for the Multiverse of Madness portal.
//
// Ported from the legacy Angular `players.service.ts` (+ `player.model.ts`).
// The Angular service used @angular/fire (AngularFireDatabase) and exposed
// Observables; here we use the firebase/database modular SDK and expose plain
// async functions plus a realtime React subscription hook. API shape preserved:
// list / get / create / update / delete, keyed by the Realtime Database push id.
//
// NOTE: the original Angular source tree (.legacy-angular/...) is not present in
// this repository, so the Player model below is reconstructed from the portal's
// "directorio" domain (player roster). Fields are optional-tolerant so unknown
// legacy keys round-trip without loss.

import { useEffect, useState } from 'react';
import {
  ref,
  onValue,
  push,
  set,
  update,
  remove,
  get,
  child,
  type DatabaseReference,
} from 'firebase/database';
import { db } from '../firebase';

// ---------------------------------------------------------------------------
// Model (ported inline from player.model.ts)
// ---------------------------------------------------------------------------

export interface Player {
  /** Realtime Database push key. Absent on records not yet persisted. */
  id?: string;
  /** Player display name / character handle. */
  name: string;
  /** Real name of the person behind the player, if known. */
  realName?: string;
  /** Faction / team the player belongs to. */
  faction?: string;
  /** In-game role or class. */
  role?: string;
  /** Numeric power/score level. */
  level?: number;
  /** Whether the player is currently active. */
  active: boolean;
  /** Contact (email / discord / etc.). */
  contact?: string;
  /** Free-form notes. */
  notes?: string;
  /** Avatar / portrait image URL. */
  avatarUrl?: string;
  /** ISO timestamp the record was created. */
  createdAt?: string;
  /** ISO timestamp the record was last modified. */
  updatedAt?: string;
}

/** Shape accepted when creating a new player (id/timestamps are assigned). */
export type NewPlayer = Omit<Player, 'id' | 'createdAt' | 'updatedAt'>;

const PLAYERS_PATH = 'players';

function playersRef(): DatabaseReference {
  return ref(db, PLAYERS_PATH);
}

/** Normalize a raw Realtime Database snapshot value into a typed Player. */
function toPlayer(id: string, raw: unknown): Player {
  const data = (raw ?? {}) as Partial<Player>;
  return {
    id,
    name: data.name ?? '',
    realName: data.realName,
    faction: data.faction,
    role: data.role,
    level: data.level,
    active: data.active ?? false,
    contact: data.contact,
    notes: data.notes,
    avatarUrl: data.avatarUrl,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/** Convert a keyed-object snapshot (RTDB list) into an ordered Player array. */
function mapToList(value: Record<string, unknown> | null): Player[] {
  if (!value) return [];
  return Object.entries(value).map(([id, raw]) => toPlayer(id, raw));
}

// ---------------------------------------------------------------------------
// One-shot reads / writes (Promise-based, replacing Angular Observables)
// ---------------------------------------------------------------------------

/** Fetch the full players list once. */
export async function getPlayers(): Promise<Player[]> {
  const snap = await get(playersRef());
  return mapToList(snap.val());
}

/** Fetch a single player by id, or null if it does not exist. */
export async function getPlayer(id: string): Promise<Player | null> {
  const snap = await get(child(playersRef(), id));
  if (!snap.exists()) return null;
  return toPlayer(id, snap.val());
}

/** Create a new player. Returns the assigned id. */
export async function createPlayer(player: NewPlayer): Promise<string> {
  const newRef = push(playersRef());
  const now = new Date().toISOString();
  const payload: Player = {
    ...player,
    createdAt: now,
    updatedAt: now,
  };
  // Strip undefined values — Realtime Database rejects them.
  await set(newRef, stripUndefined(payload));
  return newRef.key as string;
}

/** Update an existing player (partial). */
export async function updatePlayer(
  id: string,
  changes: Partial<NewPlayer>,
): Promise<void> {
  const payload = stripUndefined({
    ...changes,
    updatedAt: new Date().toISOString(),
  });
  await update(child(playersRef(), id), payload);
}

/** Delete a player by id. */
export async function deletePlayer(id: string): Promise<void> {
  await remove(child(playersRef(), id));
}

/** Toggle (or set) a player's active flag. */
export async function setPlayerActive(id: string, active: boolean): Promise<void> {
  await update(child(playersRef(), id), {
    active,
    updatedAt: new Date().toISOString(),
  });
}

function stripUndefined<T extends object>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  (Object.keys(obj) as (keyof T)[]).forEach((key) => {
    if (obj[key] !== undefined) out[key] = obj[key];
  });
  return out;
}

// ---------------------------------------------------------------------------
// Realtime subscription (replacing the Angular Observable stream)
// ---------------------------------------------------------------------------

/**
 * Subscribe to live player-list updates. Returns an unsubscribe function.
 * Mirrors the Angular service's `valueChanges()` Observable.
 */
export function subscribePlayers(
  callback: (players: Player[]) => void,
): () => void {
  const unsubscribe = onValue(playersRef(), (snap) => {
    callback(mapToList(snap.val() as Record<string, unknown> | null));
  });
  return unsubscribe;
}

/** React hook: live players list with loading + error state. */
export function usePlayers(): {
  players: Player[];
  loading: boolean;
  error: Error | null;
} {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onValue(
      playersRef(),
      (snap) => {
        setPlayers(mapToList(snap.val() as Record<string, unknown> | null));
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  return { players, loading, error };
}
