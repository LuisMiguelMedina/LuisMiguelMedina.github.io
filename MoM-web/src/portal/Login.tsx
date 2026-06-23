import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import { PORTAL_BASE } from './constants';
import './Login.scss';

interface AttemptBlock {
  fadeOut: boolean;
}

export function Login() {
  const navigate = useNavigate();
  const { login, attemptsRemaining, locked } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [visibleAttempts, setVisibleAttempts] = useState<AttemptBlock[]>(() =>
    Array(Math.max(0, attemptsRemaining)).fill(null).map(() => ({ fadeOut: false }))
  );

  const prevRemainingRef = useRef(attemptsRemaining);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincronizar los tokens visibles con attemptsRemaining del contexto de auth.
  // Si bajan, animar el fade-out del ultimo bloque antes de removerlo.
  useEffect(() => {
    const prev = prevRemainingRef.current;
    const next = Math.max(0, attemptsRemaining);
    prevRemainingRef.current = attemptsRemaining;

    if (next < prev) {
      // Marcar el ultimo bloque para fade-out, luego removerlo tras la animacion.
      setVisibleAttempts((blocks) => {
        if (blocks.length === 0) return blocks;
        const updated = blocks.slice();
        updated[updated.length - 1] = { fadeOut: true };
        return updated;
      });
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = setTimeout(() => {
        setVisibleAttempts(
          Array(next).fill(null).map(() => ({ fadeOut: false }))
        );
      }, 200);
    } else if (next !== prev) {
      setVisibleAttempts(
        Array(next).fill(null).map(() => ({ fadeOut: false }))
      );
    }
  }, [attemptsRemaining]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  const warningLevel =
    visibleAttempts.length <= 5 && visibleAttempts.length > 3;
  const criticalLevel =
    visibleAttempts.length <= 3 && visibleAttempts.length > 0;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Bloquear si no hay tokens disponibles
    if (visibleAttempts.length === 0) {
      setErrorMessage('BLOQUEO DEL SISTEMA - No quedan tokens de seguridad');
      setShowError(true);
      return;
    }

    if (isLoading || locked) return;

    setIsLoading(true);
    setErrorMessage('');
    setShowError(false);

    try {
      const result = await login(email, password);

      if (result.ok) {
        setErrorMessage('');
        setShowError(false);
        navigate(`${PORTAL_BASE}/dashboard`);
      } else {
        setShowError(true);
        setErrorMessage(result.message);
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => setShowError(false), 2000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('ERROR DE CONEXION - Sistema no disponible');
      setShowError(true);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  }

  const noTokens = visibleAttempts.length === 0;
  const formValid = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="terminal-page">
      <div className="container d-flex align-items-center justify-content-center min-vh-100">
        <div className="terminal-window" style={{ maxWidth: 500, width: '100%' }}>
          {/* Terminal Header */}
          <div className="terminal-header">
            <div className="terminal-controls">
              <span className="terminal-btn terminal-btn-close"></span>
              <span className="terminal-btn terminal-btn-minimize"></span>
              <span className="terminal-btn terminal-btn-maximize"></span>
            </div>
            <span className="terminal-title">ACCESO AL SISTEMA</span>
            <div style={{ width: 52 }}></div>
          </div>

          {/* Terminal Body */}
          <div className="terminal-body">
            {/* ASCII Logo usando divs separados para cada linea */}
            <div className="ascii-logo">
              <div>██████╗ ██╗███╗ ███╗███████╗███╗ ██╗███████╗██╗ ██████╗ ███╗ ██╗ ██████╗ </div>
              <div>██╔══██╗██║████╗ ████║██╔════╝████╗ ██║██╔════╝██║██╔═══██╗████╗ ██║ ╚════██╗</div>
              <div>██║ ██║██║██╔████╔██║█████╗ ██╔██╗ ██║███████╗██║██║ ██║██╔██╗ ██║ █████╔╝</div>
              <div>██║ ██║██║██║╚██╔╝██║██╔══╝ ██║╚██╗██║╚════██║██║██║ ██║██║╚██╗██║ ██╔═══╝ </div>
              <div>██████╔╝██║██║ ╚═╝ ██║███████╗██║ ╚████║███████║██║╚██████╔╝██║ ╚████║ ███████╗</div>
              <div>╚═════╝ ╚═╝╚═╝ ╚═╝╚══════╝╚═╝ ╚═══╝╚══════╝╚═╝ ╚═════╝ ╚═╝ ╚═══╝ ╚══════╝</div>
            </div>

            {locked ? (
              /* Locked Screen */
              <div className="terminal-locked">
                <div className="locked-icon">🔒</div>
                <div className="locked-message">SYSTEM LOCKDOWN</div>
                <div className="locked-submessage">
                  Demasiados intentos de acceso no autorizados
                </div>
                <div
                  className="locked-submessage mt-2"
                  style={{ color: 'var(--terminal-amber)' }}
                >
                  Contacte al administrador del sistema
                </div>
              </div>
            ) : (
              <>
                {/* Attempt Counter - Cuadros que desaparecen */}
                <div
                  className={`attempt-counter${warningLevel ? ' warning-level' : ''}${
                    criticalLevel ? ' critical-level' : ''
                  }`}
                >
                  <div className="attempt-label">Tokens de Seguridad</div>
                  <div className="attempt-blocks">
                    {visibleAttempts.map((attempt, index) => (
                      <div
                        key={index}
                        className={`attempt-block active${
                          attempt.fadeOut ? ' fade-out' : ''
                        }${warningLevel ? ' warning' : ''}${
                          visibleAttempts.length <= 3 ? ' critical' : ''
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={onSubmit}>
                  <div className="terminal-input-group">
                    <label className="terminal-label" htmlFor="username">
                      ID DE ADMIN
                    </label>
                    <input
                      className={`terminal-input terminal-cursor${
                        showError ? ' input-error' : ''
                      }`}
                      type="text"
                      id="username"
                      name="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </div>

                  <div className="terminal-input-group">
                    <label className="terminal-label" htmlFor="password">
                      CLAVE DE ACCESO
                    </label>
                    <input
                      className={`terminal-input terminal-cursor${
                        showError ? ' input-error' : ''
                      }`}
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </div>

                  <button
                    className={`terminal-submit${
                      noTokens ? ' disabled-locked' : ''
                    }`}
                    type="submit"
                    disabled={isLoading || !formValid || noTokens}
                  >
                    {isLoading ? (
                      <>
                        <span className="terminal-loading">
                          <span></span>
                          <span></span>
                          <span></span>
                        </span>
                        AUTENTICANDO...
                      </>
                    ) : (
                      'INICIAR SESIÓN'
                    )}
                  </button>
                </form>

                {/* Error Message */}
                {errorMessage && (
                  <div className="terminal-error">{errorMessage}</div>
                )}
              </>
            )}

            {/* Footer */}
            <div className="terminal-footer">
              <span>ZRK INTRANET v2.4.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
