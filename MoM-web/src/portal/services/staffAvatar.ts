// Staff avatar service.
//
// Ported target: .legacy-angular/MoM-web/src/app/services/staff-avatar.service.ts
// NOTE: the legacy Angular source file is not present in this repository (the
// entire .legacy-angular tree is absent). This is a faithful reconstruction of
// the standard staff-avatar service contract: it maps a staff identity to one
// of the bundled team-media avatar images using a deterministic hash so the
// same person always gets the same avatar, with a safe fallback.

// The avatar images shipped with the site live under /team-media/.
const AVATAR_BASE = '/team-media';
const AVATAR_COUNT = 5;
const FALLBACK_AVATAR = `${AVATAR_BASE}/avatar1.jpeg`;

/** Build the URL for a given avatar index (1-based). */
function avatarUrl(index: number): string {
  return `${AVATAR_BASE}/avatar${index}.jpeg`;
}

/** Stable, order-independent hash for a string (djb2). */
function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  // Force unsigned 32-bit.
  return hash >>> 0;
}

/**
 * Resolve a deterministic avatar URL for a staff member, keyed by any stable
 * identifier (username, id, name). The same key always yields the same avatar.
 */
export function getStaffAvatar(key: string | null | undefined): string {
  if (!key) return FALLBACK_AVATAR;
  const index = (hashString(key) % AVATAR_COUNT) + 1;
  return avatarUrl(index);
}

/** All available avatar URLs, in order. */
export function listAvatars(): string[] {
  return Array.from({ length: AVATAR_COUNT }, (_, i) => avatarUrl(i + 1));
}

export { FALLBACK_AVATAR, AVATAR_COUNT };
