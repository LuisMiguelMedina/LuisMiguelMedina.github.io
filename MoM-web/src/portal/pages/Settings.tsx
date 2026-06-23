import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../auth';
import './Settings.scss';

interface ServerSettings {
  serverName: string;
  maxAgents: number;
  autoSaveInterval: number;
  dimensionSyncEnabled: boolean;
  anomalyDetectionLevel: 'low' | 'medium' | 'high';
  containmentProtocol: boolean;
  debugMode: boolean;
  maintenanceMode: boolean;
}

interface NotificationSettings {
  emailAlerts: boolean;
  anomalyAlerts: boolean;
  securityAlerts: boolean;
  performanceAlerts: boolean;
}

type Tab = 'server' | 'notifications' | 'security' | 'advanced';

const DEFAULT_SERVER: ServerSettings = {
  serverName: 'DIMENSION-2 SERVER',
  maxAgents: 100,
  autoSaveInterval: 300,
  dimensionSyncEnabled: true,
  anomalyDetectionLevel: 'medium',
  containmentProtocol: true,
  debugMode: false,
  maintenanceMode: false,
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  emailAlerts: true,
  anomalyAlerts: true,
  securityAlerts: true,
  performanceAlerts: false,
};

export function Settings(): JSX.Element {
  const { level } = useAuth();

  const [serverSettings, setServerSettings] = useState<ServerSettings>(DEFAULT_SERVER);
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('server');

  useEffect(() => {
    const settingsRef = ref(db, 'system/settings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.server) {
          setServerSettings((prev) => ({ ...prev, ...data.server }));
        }
        if (data.notifications) {
          setNotificationSettings((prev) => ({ ...prev, ...data.notifications }));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  async function saveSettings(): Promise<void> {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await set(ref(db, 'system/settings'), {
        server: serverSettings,
        notifications: notificationSettings,
        lastModified: new Date().toISOString(),
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  }

  function resetToDefaults(): void {
    setServerSettings(DEFAULT_SERVER);
    setNotificationSettings(DEFAULT_NOTIFICATIONS);
  }

  function updateServer<K extends keyof ServerSettings>(key: K, value: ServerSettings[K]): void {
    setServerSettings((prev) => ({ ...prev, [key]: value }));
  }

  function updateNotifications<K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ): void {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <div className="header-info">
          <h1>
            <i className="fas fa-cog me-2" />
            Configuración
          </h1>
          <p className="header-subtitle">Configurar parámetros del Servidor Dimensión-2</p>
        </div>
        <div className="header-actions">
          <button
            className="settings-btn secondary"
            onClick={resetToDefaults}
            disabled={isSaving}
          >
            <i className="fas fa-undo" />
            Restablecer
          </button>
          <button className="settings-btn primary" onClick={saveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin" />
                Guardando...
              </>
            ) : (
              <>
                <i className="fas fa-save" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="save-notification">
          <i className="fas fa-check-circle" />
          Configuración guardada correctamente
        </div>
      )}

      {/* Tabs */}
      <div className="settings-tabs">
        <button
          className={`tab-btn ${activeTab === 'server' ? 'active' : ''}`}
          onClick={() => setActiveTab('server')}
        >
          <i className="fas fa-server" />
          Servidor
        </button>
        <button
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <i className="fas fa-bell" />
          Notificaciones
        </button>
        <button
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <i className="fas fa-shield-alt" />
          Seguridad
        </button>
        {level >= 3 && (
          <button
            className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            <i className="fas fa-flask" />
            Avanzado
          </button>
        )}
      </div>

      {/* Server Tab */}
      {activeTab === 'server' && (
        <div className="settings-panel">
          <div className="panel-section">
            <h3 className="section-title">Configuración General</h3>

            <div className="setting-item">
              <div className="setting-info">
                <label>Nombre del Servidor</label>
                <span className="setting-desc">Nombre visible del servidor</span>
              </div>
              <input
                type="text"
                className="setting-input"
                value={serverSettings.serverName}
                onChange={(e) => updateServer('serverName', e.target.value)}
              />
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Máx. Agentes</label>
                <span className="setting-desc">Número máximo de agentes registrados</span>
              </div>
              <input
                type="number"
                className="setting-input small"
                value={serverSettings.maxAgents}
                min={1}
                max={1000}
                onChange={(e) => updateServer('maxAgents', Number(e.target.value))}
              />
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Intervalo de Auto-Guardado</label>
                <span className="setting-desc">Segundos entre guardados automáticos</span>
              </div>
              <select
                className="setting-select"
                value={serverSettings.autoSaveInterval}
                onChange={(e) => updateServer('autoSaveInterval', Number(e.target.value))}
              >
                <option value={60}>1 minuto</option>
                <option value={300}>5 minutos</option>
                <option value={600}>10 minutos</option>
                <option value={1800}>30 minutos</option>
              </select>
            </div>
          </div>

          <div className="panel-section">
            <h3 className="section-title">Control Dimensional</h3>

            <div className="setting-item">
              <div className="setting-info">
                <label>Sincronización Dimensional</label>
                <span className="setting-desc">Habilitar sincronización entre dimensiones</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={serverSettings.dimensionSyncEnabled}
                  onChange={(e) => updateServer('dimensionSyncEnabled', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Nivel de Detección de Anomalías</label>
                <span className="setting-desc">
                  Sensibilidad del sistema de detección de anomalías
                </span>
              </div>
              <select
                className="setting-select"
                value={serverSettings.anomalyDetectionLevel}
                onChange={(e) =>
                  updateServer(
                    'anomalyDetectionLevel',
                    e.target.value as ServerSettings['anomalyDetectionLevel']
                  )
                }
              >
                <option value="low">Bajo</option>
                <option value="medium">Medio</option>
                <option value="high">Alto</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Protocolo de Contención</label>
                <span className="setting-desc">
                  Habilitar contención automática para anomalías
                </span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={serverSettings.containmentProtocol}
                  onChange={(e) => updateServer('containmentProtocol', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="settings-panel">
          <div className="panel-section">
            <h3 className="section-title">Preferencias de Alertas</h3>

            <div className="setting-item">
              <div className="setting-info">
                <label>Alertas por Correo</label>
                <span className="setting-desc">Recibir alertas por correo electrónico</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailAlerts}
                  onChange={(e) => updateNotifications('emailAlerts', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Alertas de Anomalías</label>
                <span className="setting-desc">Notificar sobre anomalías dimensionales</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.anomalyAlerts}
                  onChange={(e) => updateNotifications('anomalyAlerts', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Alertas de Seguridad</label>
                <span className="setting-desc">Notificar sobre eventos de seguridad</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.securityAlerts}
                  onChange={(e) => updateNotifications('securityAlerts', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Alertas de Rendimiento</label>
                <span className="setting-desc">Notificar sobre problemas de rendimiento</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notificationSettings.performanceAlerts}
                  onChange={(e) => updateNotifications('performanceAlerts', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="settings-panel">
          <div className="panel-section">
            <h3 className="section-title">Configuración de Seguridad</h3>

            <div className="security-info">
              <div className="security-badge">
                <i className="fas fa-lock" />
                <span>Encriptación QUANTUM-256</span>
              </div>
              <p>
                Todas las conexiones están aseguradas con encriptación resistente a computación
                cuántica
              </p>
            </div>

            <div className="setting-item readonly">
              <div className="setting-info">
                <label>Protocolo de Encriptación</label>
                <span className="setting-desc">Estándar de encriptación actual</span>
              </div>
              <span className="setting-value">QUANTUM-256</span>
            </div>

            <div className="setting-item readonly">
              <div className="setting-info">
                <label>Estado del Firewall</label>
                <span className="setting-desc">Estado del firewall dimensional</span>
              </div>
              <span className="setting-value status-active">
                <i className="fas fa-check-circle" /> ACTIVO
              </span>
            </div>

            <div className="setting-item readonly">
              <div className="setting-info">
                <label>Última Auditoría de Seguridad</label>
                <span className="setting-desc">Escaneo integral más reciente</span>
              </div>
              <span className="setting-value">hace 6 horas</span>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Tab (Level 3+ only) */}
      {activeTab === 'advanced' && level >= 3 && (
        <div className="settings-panel">
          <div className="panel-section danger-zone">
            <h3 className="section-title">
              <i className="fas fa-exclamation-triangle" />
              Configuración Avanzada
            </h3>
            <p className="danger-warning">
              Estas configuraciones pueden afectar la estabilidad del servidor. Proceda con
              precaución.
            </p>

            <div className="setting-item">
              <div className="setting-info">
                <label>Modo de Depuración</label>
                <span className="setting-desc">Habilitar registro detallado y diagnósticos</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={serverSettings.debugMode}
                  onChange={(e) => updateServer('debugMode', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label>Modo de Mantenimiento</label>
                <span className="setting-desc">Poner servidor en modo de mantenimiento</span>
              </div>
              <label className="toggle-switch danger">
                <input
                  type="checkbox"
                  checked={serverSettings.maintenanceMode}
                  onChange={(e) => updateServer('maintenanceMode', e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
