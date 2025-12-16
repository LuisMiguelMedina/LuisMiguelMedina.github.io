export interface Player {
    id: string;
    name: string;
    dimension: 1 | 2;
    status: 1 | 2; // 1 = active, 2 = inactive (shows X overlay)
    image: string; // base64 encoded image
}

export interface Dimension {
    id: string;
    name: string;
    color: 'amber' | 'cyan';
    status: 'online' | 'offline' | 'maintenance';
    description: string;
    playerCount?: number;
}

export const DEFAULT_DIMENSIONS: Dimension[] = [
    {
        id: 'dimension1',
        name: 'Dimension 1',
        color: 'amber',
        status: 'online',
        description: 'Mundo Principal'
    },
    {
        id: 'dimension2',
        name: 'Dimension 2',
        color: 'cyan',
        status: 'online',
        description: 'Mundo Secundario'
    }
];
