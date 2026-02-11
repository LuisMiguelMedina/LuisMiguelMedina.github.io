import { Injectable, inject, signal, OnDestroy, DestroyRef } from '@angular/core';
import { Database, ref, set, onValue, off } from '@angular/fire/database';

// Default placeholder SVG (matches player style)
const DEFAULT_STAFF_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMzMzMiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIyMCIgZmlsbD0iIzY2NiIvPjxlbGxpcHNlIGN4PSI1MCIgY3k9Ijg1IiByeD0iMzAiIHJ5PSIyMCIgZmlsbD0iIzY2NiIvPjwvc3ZnPg==';

const FIREBASE_STAFF_AVATARS_PATH = 'staff_avatars';

// Staff ID to UUID mapping for profile matching
export const STAFF_UUID_MAP: Record<string, string> = {
    'ZRK-001': 'KTH-M2-0021',
    'ZRK-002': 'MQN-E1-0002',
    'ZRK-003': 'NVA-S3-0089',
    'ZRK-004': 'VLX-U2-0156',
    'ZRK-005': 'EVR-D7-0012',
    'ZRK-006': 'ARX-O3-0045',
    'ZRK-007': 'FLX-N2-0312',
    'ZRK-008': 'GNS-S4-0008',
    'ZRK-009': 'TRN-U2-0178',
    'ZRK-010': 'SPK-A1-0401',
    'ZRK-011': 'JKL-A1-0777',
    'ZRK-012': 'AZK-G4-0003',
    'ZRK-013': 'MSM-S3-0142'
};

// Reverse map: UUID -> staffId
const UUID_TO_STAFF: Record<string, string> = Object.fromEntries(
    Object.entries(STAFF_UUID_MAP).map(([k, v]) => [v, k])
);

// Staff names for generating initial-based default avatars
const STAFF_NAMES: Record<string, string> = {
    'ZRK-001': 'Katherine M.2',
    'ZRK-002': 'Hugh Everett',
    'ZRK-003': 'Emmy Noether',
    'ZRK-004': 'Max Planck',
    'ZRK-005': 'Kaluza Zarek',
    'ZRK-006': 'Paul Dirac',
    'ZRK-007': 'Werner Heisenberg',
    'ZRK-008': 'Dr. Richard Feynman',
    'ZRK-009': 'Michio Kaku',
    'ZRK-010': 'Erwin Schrödinger',
    'ZRK-011': 'Dr. Jeckyll',
    'ZRK-012': 'Amanda Zarek',
    'ZRK-013': 'Martin Seamus'
};

// Unique colors for each staff member
const STAFF_COLORS: Record<string, string> = {
    'ZRK-001': '#4A90D9',  // Azul
    'ZRK-002': '#FFD700',  // Dorado
    'ZRK-003': '#9B59B6',  // Morado
    'ZRK-004': '#E74C3C',  // Rojo
    'ZRK-005': '#2ECC71',  // Verde
    'ZRK-006': '#E67E22',  // Naranja
    'ZRK-007': '#1ABC9C',  // Turquesa
    'ZRK-008': '#F39C12',  // Amarillo
    'ZRK-009': '#3498DB',  // Azul claro
    'ZRK-010': '#8E44AD',  // Púrpura
    'ZRK-011': '#00CED1',  // Cyan oscuro
    'ZRK-012': '#C0392B',  // Rojo oscuro
    'ZRK-013': '#27AE60'   // Verde oscuro
};

@Injectable({
    providedIn: 'root'
})
export class StaffAvatarService implements OnDestroy {
    private database = inject(Database);
    private destroyRef = inject(DestroyRef);
    private listenerRef: any;

    // Signal: staffId -> base64 image
    private avatarsSignal = signal<Record<string, string>>({});
    private loadedSignal = signal<boolean>(false);

    avatars = this.avatarsSignal.asReadonly();
    loaded = this.loadedSignal.asReadonly();

    constructor() {
        this.loadFromFirebase();
        this.destroyRef.onDestroy(() => this.cleanup());
    }

    ngOnDestroy(): void {
        this.cleanup();
    }

    private cleanup(): void {
        if (this.listenerRef) off(this.listenerRef);
    }

    private loadFromFirebase(): void {
        this.listenerRef = ref(this.database, FIREBASE_STAFF_AVATARS_PATH);
        onValue(this.listenerRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                this.avatarsSignal.set(data as Record<string, string>);
            } else {
                // No avatars in Firebase yet — initialize with generated defaults
                this.initializeDefaults();
            }
            this.loadedSignal.set(true);
        }, (error) => {
            console.error('Firebase staff avatars error:', error);
            this.loadedSignal.set(true);
        });
    }

    /**
     * Initializes default avatars in Firebase — SVGs with initials and unique colors
     */
    private async initializeDefaults(): Promise<void> {
        const defaults: Record<string, string> = {};
        for (const staffId of Object.keys(STAFF_NAMES)) {
            defaults[staffId] = this.generateInitialAvatar(staffId);
        }
        try {
            await set(ref(this.database, FIREBASE_STAFF_AVATARS_PATH), defaults);
            this.avatarsSignal.set(defaults);
        } catch (e) {
            console.error('Error initializing staff avatars:', e);
            // Use locally generated fallback
            this.avatarsSignal.set(defaults);
        }
    }

    /**
     * Generates an SVG avatar with initials and unique color, encoded as base64 data URI
     */
    private generateInitialAvatar(staffId: string): string {
        const name = STAFF_NAMES[staffId] || 'NN';
        const color = STAFF_COLORS[staffId] || '#666';
        const initials = this.getInitials(name);

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <rect width="100" height="100" rx="8" fill="${color}"/>
            <rect x="2" y="2" width="96" height="96" rx="6" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
            <text x="50" y="55" font-family="monospace, 'Courier New'" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${initials}</text>
            <text x="50" y="88" font-family="monospace, 'Courier New'" font-size="9" fill="rgba(255,255,255,0.6)" text-anchor="middle">${staffId}</text>
        </svg>`;

        return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    }

    private getInitials(name: string): string {
        // Remove prefixes like "Dr. "
        const cleaned = name.replace(/^(Dr\.\s+)/, '');
        const parts = cleaned.split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return cleaned.substring(0, 2).toUpperCase();
    }

    /**
     * Get avatar by staff ID (ZRK-001, etc.)
     */
    getAvatarByStaffId(staffId: string): string {
        return this.avatars()[staffId] || this.generateInitialAvatar(staffId);
    }

    /**
     * Get avatar by UUID (KTH-M2-0021, etc.)
     */
    getAvatarByUuid(uuid: string): string {
        const staffId = UUID_TO_STAFF[uuid];
        if (staffId) {
            return this.getAvatarByStaffId(staffId);
        }
        return DEFAULT_STAFF_AVATAR;
    }

    /**
     * Update a staff avatar in Firebase (base64 image)
     */
    async updateAvatar(staffId: string, imageBase64: string): Promise<void> {
        try {
            await set(ref(this.database, `${FIREBASE_STAFF_AVATARS_PATH}/${staffId}`), imageBase64);
        } catch (e) {
            console.error('Error updating staff avatar:', e);
        }
    }
}
