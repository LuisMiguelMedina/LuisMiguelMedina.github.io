import type { JSX } from 'react';
// Players / Dimensions monitoring page for the Multiverse of Madness portal.
//
// Ported faithfully from the legacy Angular component
// (.legacy-angular/MoM-web/src/app/components/players/). Mounted as a child
// route at `${PORTAL_BASE}/monitoreo` inside <Layout/>.
//
// NOTE on services: the ported services/players.ts uses a different domain
// model (active: boolean, avatarUrl, no "dimensions" node) than this legacy
// page requires (dimension: 1|2, status: 1|2, image, plus a "dimensions"
// RTDB node). To stay faithful to the legacy behaviour without inventing new
// service APIs, this page reads the `players` and `dimensions` RTDB nodes
// directly via the firebase/database modular SDK — exactly as the legacy
// PlayersService did (ref/onValue). Defaults are applied when nodes are empty
// so the page degrades gracefully (no writes / no auto-seeding are performed).

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import './Players.scss';

// ---------------------------------------------------------------------------
// Model (ported from legacy player.model.ts)
// ---------------------------------------------------------------------------

interface LegacyPlayer {
  id: string;
  name: string;
  dimension: 1 | 2;
  status: 1 | 2; // 1 = active, 2 = inactive (shows X overlay)
  image: string;
}

interface Dimension {
  id: string;
  name: string;
  color: 'amber' | 'cyan';
  status: 'online' | 'offline' | 'maintenance';
  description: string;
}

// Default placeholder image (simple avatar) — verbatim from legacy service.
const DEFAULT_PLAYER_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMzMzMiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIyMCIgZmlsbD0iIzY2NiIvPjxlbGxpcHNlIGN4PSI1MCIgY3k9Ijg1IiByeD0iMzAiIHJ5PSIyMCIgZmlsbD0iIzY2NiIvPjwvc3ZnPg==';

const FIREBASE_PLAYERS_PATH = 'players';
const FIREBASE_DIMENSIONS_PATH = 'dimensions';

const DEFAULT_DIMENSIONS: Dimension[] = [
  {
    id: 'dimension1',
    name: 'Dimension 1',
    color: 'amber',
    status: 'online',
    description: 'Mundo Principal',
  },
  {
    id: 'dimension2',
    name: 'Dimension 2',
    color: 'cyan',
    status: 'online',
    description: 'Mundo Secundario',
  },
];

// ---------------------------------------------------------------------------
// Data hook (replaces the Angular PlayersService signals)
// ---------------------------------------------------------------------------

function usePlayersData(): {
  players: LegacyPlayer[];
  dimensions: Dimension[];
  loading: boolean;
} {
  const [players, setPlayers] = useState<LegacyPlayer[]>([]);
  const [dimensions, setDimensions] = useState<Dimension[]>(DEFAULT_DIMENSIONS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const playersRef = ref(db, FIREBASE_PLAYERS_PATH);
    const dimensionsRef = ref(db, FIREBASE_DIMENSIONS_PATH);

    const offPlayers = onValue(
      playersRef,
      (snapshot) => {
        const data = snapshot.val() as Record<string, Partial<LegacyPlayer>> | null;
        if (data) {
          const list = Object.entries(data).map(([id, player]) => ({
            id,
            name: player.name || 'Unknown Player',
            dimension: (player.dimension || 1) as 1 | 2,
            status: (player.status || 1) as 1 | 2,
            image: player.image || DEFAULT_PLAYER_IMAGE,
          }));
          setPlayers(list);
        } else {
          // Degrade gracefully: no auto-seeding, just an empty roster.
          setPlayers([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firebase players error:', error);
        setLoading(false);
      },
    );

    const offDimensions = onValue(dimensionsRef, (snapshot) => {
      const data = snapshot.val() as Record<string, Partial<Dimension>> | null;
      if (data) {
        const list = Object.entries(data).map(([id, dim]) => ({
          id,
          name: dim.name ?? '',
          color: (dim.color ?? 'cyan') as 'amber' | 'cyan',
          status: (dim.status ?? 'online') as Dimension['status'],
          description: dim.description ?? '',
        }));
        setDimensions(list);
      } else {
        setDimensions(DEFAULT_DIMENSIONS);
      }
    });

    return () => {
      offPlayers();
      offDimensions();
    };
  }, []);

  return { players, dimensions, loading };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Players(): JSX.Element {
  const { players, dimensions, loading } = usePlayersData();
  const [selectedDimension, setSelectedDimension] = useState<1 | 2>(1);

  // Cheap filters over a small roster — no memoization needed.
  const currentPlayers = players.filter((p) => p.dimension === selectedDimension);
  const currentDimension = dimensions.find(
    (d) => d.id === (selectedDimension === 1 ? 'dimension1' : 'dimension2'),
  );

  const totalPlayers = currentPlayers.length;
  const activePlayers = currentPlayers.filter((p) => p.status === 1).length;
  const inactivePlayers = currentPlayers.filter((p) => p.status === 2).length;

  const dimension1Players = players.filter((p) => p.dimension === 1).length;
  const dimension2Players = players.filter((p) => p.dimension === 2).length;

  const getStatusText = (): string => {
    const dim = currentDimension;
    if (!dim) return 'UNKNOWN';
    switch (dim.status) {
      case 'online':
        return 'ONLINE';
      case 'offline':
        return 'OFFLINE';
      case 'maintenance':
        return 'MAINTENANCE';
      default:
        return 'UNKNOWN';
    }
  };

  const getStatusClass = (): string => {
    const dim = currentDimension;
    if (!dim) return '';
    switch (dim.status) {
      case 'online':
        return 'status-online';
      case 'offline':
        return 'status-offline';
      case 'maintenance':
        return 'status-maintenance';
      default:
        return '';
    }
  };

  const onImageError = (event: React.SyntheticEvent<HTMLImageElement>): void => {
    event.currentTarget.src = '/favicon.ico';
  };

  return (
    <>
      {/* Players/Dimensions Page */}
      <div className="matrix-page-header">
        <div className="header-title">
          <h3>Monitoreo</h3>
          <div className="welcome-text">&gt; Sistema de Dimensiones</div>
        </div>
      </div>

      {/* Dimension Tabs */}
      <div className="dimension-tabs">
        <button
          className={`dimension-tab dimension-1${selectedDimension === 1 ? ' active' : ''}`}
          onClick={() => setSelectedDimension(1)}
        >
          <div className="tab-icon">🌍</div>
          <div className="tab-content">
            <span className="tab-name">Dimension 1</span>
            <span className="tab-count">{dimension1Players} Actores Ficticios </span>
          </div>
        </button>

        <button
          className={`dimension-tab dimension-2${selectedDimension === 2 ? ' active' : ''}`}
          onClick={() => setSelectedDimension(2)}
        >
          <div className="tab-icon">🌐</div>
          <div className="tab-content">
            <span className="tab-name">Dimension 2</span>
            <span className="tab-count">{dimension2Players} Actores Ficticios </span>
          </div>
        </button>
      </div>

      {/* Main Content Area */}
      <div
        className={`dimension-content${
          selectedDimension === 1 ? ' dimension-1-active' : ''
        }${selectedDimension === 2 ? ' dimension-2-active' : ''}`}
      >
        <div className="row">
          {/* Players Grid */}
          <div className="col-lg-8 col-md-7">
            <div className="players-container">
              <div className="section-header">
                <h5>
                  <i className="fas fa-users me-2" />
                  Actores Ficticios en {currentDimension?.name}
                </h5>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner" />
                  <span>Cargando Actores Ficticios...</span>
                </div>
              ) : currentPlayers.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-user-slash" />
                  <p>No hay Actores Ficticios en esta dimensión</p>
                </div>
              ) : (
                <div className="players-grid">
                  {currentPlayers.map((player) => (
                    <div
                      key={player.id}
                      className={`player-card${player.status === 2 ? ' inactive' : ''}`}
                    >
                      <div className="player-avatar">
                        <img src={player.image} alt={player.name} onError={onImageError} />
                        {player.status === 2 && (
                          <div className="inactive-overlay">
                            <i className="fas fa-times" />
                          </div>
                        )}
                      </div>
                      <div className="player-info">
                        <span className="player-name">{player.name}</span>
                        <span
                          className={`player-status${player.status === 1 ? ' active' : ''}${
                            player.status === 2 ? ' inactive' : ''
                          }`}
                        >
                          {player.status === 1 ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dimension Status Panel */}
          <div className="col-lg-4 col-md-5">
            <div className="dimension-status-panel">
              <div className="section-header">
                <h5>
                  <i className="fas fa-globe me-2" />
                  Estado del Mundo
                </h5>
              </div>

              <div
                className={`world-visual${selectedDimension === 1 ? ' world-amber' : ''}${
                  selectedDimension === 2 ? ' world-cyan' : ''
                }`}
              >
                <div className="world-sphere">
                  <div className="world-glow" />
                  <div className="world-emoji">{selectedDimension === 1 ? '🌍' : '🌐'}</div>
                </div>
              </div>

              <div className="status-info">
                <div className="status-row">
                  <span className="status-label">NOMBRE:</span>
                  <span className="status-value">{currentDimension?.name}</span>
                </div>
                <div className="status-row">
                  <span className="status-label">ESTADO:</span>
                  <span className={`status-value ${getStatusClass()}`}>{getStatusText()}</span>
                </div>
                <div className="status-row">
                  <span className="status-label">DESCRIPCIÓN:</span>
                  <span className="status-value small">{currentDimension?.description}</span>
                </div>
              </div>

              <div className="divider" />

              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{totalPlayers}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat-item active">
                  <span className="stat-value">{activePlayers}</span>
                  <span className="stat-label">Activos</span>
                </div>
                <div className="stat-item inactive">
                  <span className="stat-value">{inactivePlayers}</span>
                  <span className="stat-label">Inactivos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
