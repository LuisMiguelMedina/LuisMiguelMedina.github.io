import { Injectable, inject, signal, OnDestroy, DestroyRef } from '@angular/core';
import { Database, ref, set, onValue, off } from '@angular/fire/database';
import { Player, Dimension, DEFAULT_DIMENSIONS } from '../models/player.model';

// Default placeholder image (simple avatar)
const DEFAULT_PLAYER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMzMzMiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIyMCIgZmlsbD0iIzY2NiIvPjxlbGxpcHNlIGN4PSI1MCIgY3k9Ijg1IiByeD0iMzAiIHJ5PSIyMCIgZmlsbD0iIzY2NiIvPjwvc3ZnPg==';

const FIREBASE_PLAYERS_PATH = 'players';
const FIREBASE_DIMENSIONS_PATH = 'dimensions';

@Injectable({
    providedIn: 'root'
})
export class PlayersService implements OnDestroy {
    private database = inject(Database);
    private destroyRef = inject(DestroyRef);

    private playersRef: any;
    private dimensionsRef: any;

    // Signals
    private playersSignal = signal<Player[]>([]);
    private dimensionsSignal = signal<Dimension[]>(DEFAULT_DIMENSIONS);
    private loadingSignal = signal<boolean>(true);

    // Public readonly
    players = this.playersSignal.asReadonly();
    dimensions = this.dimensionsSignal.asReadonly();
    loading = this.loadingSignal.asReadonly();

    constructor() {
        this.loadFromFirebase();

        this.destroyRef.onDestroy(() => {
            this.cleanup();
        });
    }

    ngOnDestroy(): void {
        this.cleanup();
    }

    private cleanup(): void {
        if (this.playersRef) off(this.playersRef);
        if (this.dimensionsRef) off(this.dimensionsRef);
    }

    private loadFromFirebase(): void {
        this.loadingSignal.set(true);

        // Load players
        this.playersRef = ref(this.database, FIREBASE_PLAYERS_PATH);
        onValue(this.playersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const players = Object.entries(data).map(([id, player]: [string, any]) => ({
                    id,
                    name: player.name || 'Unknown Player',
                    dimension: player.dimension || 1,
                    status: player.status || 1,
                    image: player.image || DEFAULT_PLAYER_IMAGE
                })) as Player[];
                this.playersSignal.set(players);
            } else {
                // Initialize with sample players
                this.initializeDefaultPlayers();
            }
            this.loadingSignal.set(false);
        }, (error) => {
            console.error('Firebase players error:', error);
            this.loadingSignal.set(false);
        });

        // Load dimensions
        this.dimensionsRef = ref(this.database, FIREBASE_DIMENSIONS_PATH);
        onValue(this.dimensionsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const dimensions = Object.entries(data).map(([id, dim]: [string, any]) => ({
                    id,
                    name: dim.name,
                    color: dim.color,
                    status: dim.status || 'online',
                    description: dim.description
                })) as Dimension[];
                this.dimensionsSignal.set(dimensions);
            } else {
                this.initializeDefaultDimensions();
            }
        });
    }

    private async initializeDefaultPlayers(): Promise<void> {
        const players: { [key: string]: Omit<Player, 'id'> } = {
            player1: {
                name: 'CyberNinja',
                dimension: 1,
                status: 1,
                image: DEFAULT_PLAYER_IMAGE
            },
            player2: {
                name: 'QuantumKnight',
                dimension: 1,
                status: 1,
                image: DEFAULT_PLAYER_IMAGE
            },
            player3: {
                name: 'NeonShadow',
                dimension: 1,
                status: 2,
                image: DEFAULT_PLAYER_IMAGE
            },
            player4: {
                name: 'VoidWalker',
                dimension: 2,
                status: 1,
                image: DEFAULT_PLAYER_IMAGE
            },
            player5: {
                name: 'MatrixRunner',
                dimension: 2,
                status: 1,
                image: DEFAULT_PLAYER_IMAGE
            },
            player6: {
                name: 'GhostByte',
                dimension: 2,
                status: 2,
                image: DEFAULT_PLAYER_IMAGE
            }
        };

        try {
            await set(ref(this.database, FIREBASE_PLAYERS_PATH), players);
            const playersList = Object.entries(players).map(([id, p]) => ({ id, ...p })) as Player[];
            this.playersSignal.set(playersList);
        } catch (e) {
            console.error('Error initializing players:', e);
        }
    }

    private async initializeDefaultDimensions(): Promise<void> {
        const dimensions: { [key: string]: Omit<Dimension, 'id'> } = {
            dimension1: {
                name: 'Dimension 1',
                color: 'amber',
                status: 'online',
                description: 'Mundo Principal - El reino dorado'
            },
            dimension2: {
                name: 'Dimension 2',
                color: 'cyan',
                status: 'online',
                description: 'Mundo Secundario - La matrix azul'
            }
        };

        try {
            await set(ref(this.database, FIREBASE_DIMENSIONS_PATH), dimensions);
            const dimList = Object.entries(dimensions).map(([id, d]) => ({ id, ...d })) as Dimension[];
            this.dimensionsSignal.set(dimList);
        } catch (e) {
            console.error('Error initializing dimensions:', e);
        }
    }

    // Get players by dimension
    getPlayersByDimension(dimension: 1 | 2): Player[] {
        return this.players().filter(p => p.dimension === dimension);
    }

    // Get player count by dimension
    getPlayerCount(dimension: 1 | 2): number {
        return this.getPlayersByDimension(dimension).length;
    }

    // Get active player count by dimension
    getActivePlayerCount(dimension: 1 | 2): number {
        return this.getPlayersByDimension(dimension).filter(p => p.status === 1).length;
    }

    // Get dimension by id
    getDimension(dimensionNum: 1 | 2): Dimension | undefined {
        const id = dimensionNum === 1 ? 'dimension1' : 'dimension2';
        return this.dimensions().find(d => d.id === id);
    }

    // Update player status
    async updatePlayerStatus(playerId: string, status: 1 | 2): Promise<void> {
        try {
            await set(ref(this.database, `${FIREBASE_PLAYERS_PATH}/${playerId}/status`), status);
        } catch (e) {
            console.error('Error updating player status:', e);
        }
    }

    // Update player image
    async updatePlayerImage(playerId: string, imageBase64: string): Promise<void> {
        try {
            await set(ref(this.database, `${FIREBASE_PLAYERS_PATH}/${playerId}/image`), imageBase64);
        } catch (e) {
            console.error('Error updating player image:', e);
        }
    }
}
