import { useState } from 'react';
import './Register.scss';

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

const EMPTY: RegisterData = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
};

export function Register() {
  const [data, setData] = useState<RegisterData>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function update<K extends keyof RegisterData>(key: K, value: RegisterData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;

    // Validate passwords match (faithful to legacy register.ts)
    if (data.password !== data.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // The ported portal does not expose a public registration API
      // (auth.tsx only provides login/logout for admin sessions).
      // Degrade gracefully instead of inventing an endpoint.
      setErrorMessage(
        'El registro de nuevos usuarios no está disponible en este portal.'
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Error de conexión'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="matrix-page-header">
        <h1>
          <i className="fas fa-user-plus" /> Registro de Usuario
        </h1>
      </div>

      <div className="matrix-card register-card">
        <form onSubmit={onSubmit} noValidate>
          <div className="register-grid">
            <div className="terminal-input-group">
              <label className="terminal-label" htmlFor="firstName">
                Nombre
              </label>
              <input
                id="firstName"
                className="terminal-input"
                type="text"
                value={data.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                disabled={isLoading}
                autoComplete="given-name"
              />
            </div>

            <div className="terminal-input-group">
              <label className="terminal-label" htmlFor="lastName">
                Apellido
              </label>
              <input
                id="lastName"
                className="terminal-input"
                type="text"
                value={data.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                disabled={isLoading}
                autoComplete="family-name"
              />
            </div>

            <div className="terminal-input-group register-grid--full">
              <label className="terminal-label" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                className="terminal-input"
                type="email"
                value={data.email}
                onChange={(e) => update('email', e.target.value)}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="terminal-input-group">
              <label className="terminal-label" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                className="terminal-input"
                type="password"
                value={data.password}
                onChange={(e) => update('password', e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <div className="terminal-input-group">
              <label className="terminal-label" htmlFor="confirmPassword">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                className="terminal-input"
                type="password"
                value={data.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="terminal-error">{errorMessage}</div>
          )}

          <button
            type="submit"
            className="terminal-submit matrix-btn"
            disabled={
              isLoading ||
              !data.email ||
              !data.password ||
              !data.confirmPassword
            }
          >
            {isLoading ? 'PROCESANDO...' : 'CREAR CUENTA'}
          </button>
        </form>

        <div className="register-notice">
          <i className="fas fa-triangle-exclamation" />
          El registro público está deshabilitado. El acceso al portal se
          gestiona mediante credenciales de administrador.
        </div>
      </div>
    </div>
  );
}
