import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SamCommissions.scss';

// Mockup landing for Sam's commissions — retro diner "menu" layout.
// Placeholder content/art; this whole page is expected to be reworked later.

const ABOUT = [
  'él / ella',
  'veintitrés',
  'texto de ejemplo sobre Sam y su trabajo',
  'dibuja principalmente OCs humanoides',
];

const INFO = [
  'acepta fuego amistoso',
  'la revancha no está garantizada',
  'sin cadenas de ataques',
  '~10 ataques al año',
];

const SOCIALS = ['@sam en..', 'youtube', 'twitter', 'tiktok', 'instagram', 'toyhouse'];

const MENU = [
  { name: 'oc uno', dish: '🍔' },
  { name: 'oc dos', dish: '🥞' },
  { name: 'oc tres', dish: '🍳' },
  { name: 'oc cuatro', dish: '🌭' },
  { name: 'oc cinco', dish: '🍦' },
  { name: 'oc seis', dish: '🥐' },
  { name: 'oc siete', dish: '🍮' },
  { name: 'oc ocho', dish: '🥪' },
];

export function SamCommissionsPage() {
  const [pick, setPick] = useState<string | null>(null);
  const randomOc = (): void => setPick(MENU[Math.floor(Math.random() * MENU.length)].name);

  return (
    <div className="sam-commissions">
      <Link className="sc-back" to="/home">
        ← volver al roster
      </Link>

      <div className="sc-frame">
        {/* Diner marquee sign */}
        <div className="sc-marquee" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        {/* Hero */}
        <header className="sc-hero">
          <div className="sc-hero-awning" aria-hidden="true" />
          <div className="sc-portrait" aria-hidden="true">
            🧑‍🍳
          </div>
          <div className="sc-title">
            <h1>Sam</h1>
            <span className="sc-tag">comisiones</span>
          </div>
        </header>

        {/* Info cards */}
        <section className="sc-cards">
          <article className="sc-card">
            <div className="sc-plate">
              <span className="sc-plate-emoji" aria-hidden="true">
                🥐
              </span>
              <span className="sc-plate-label">sobre mí</span>
            </div>
            <ul>
              {ABOUT.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>

          <article className="sc-card">
            <div className="sc-plate">
              <span className="sc-plate-emoji" aria-hidden="true">
                🥞
              </span>
              <span className="sc-plate-label">info</span>
            </div>
            <ul>
              {INFO.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>

          <article className="sc-card">
            <div className="sc-plate">
              <span className="sc-plate-emoji" aria-hidden="true">
                🥪
              </span>
              <span className="sc-plate-label">redes</span>
            </div>
            <ul>
              {SOCIALS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        </section>

        {/* Menu */}
        <section className="sc-menu">
          <div className="sc-menu-head">
            <h2>el Menú</h2>
            <span className="sc-chef" aria-hidden="true">
              🧑‍🍳
            </span>
          </div>
          <div className="sc-menu-grid">
            {MENU.map((item) => (
              <div className="sc-dish" key={item.name}>
                <span className="sc-dish-emoji" aria-hidden="true">
                  {item.dish}
                </span>
                <span className="sc-dish-name">{item.name}</span>
              </div>
            ))}
          </div>
          <span className="sc-more">¡y más!</span>
        </section>

        {/* Random OC */}
        <button className="sc-random" type="button" onClick={randomOc}>
          <span className="sc-random-icon" aria-hidden="true">
            🍽️
          </span>
          {pick ? `¡te tocó: ${pick}!` : 'click para un OC aleatorio'}
        </button>
      </div>

      <p className="sc-note">Diseño de muestra — se modificará más adelante.</p>
    </div>
  );
}
