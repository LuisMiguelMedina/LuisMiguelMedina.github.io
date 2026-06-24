import { useLang } from '../i18n';
import './LanguageToggle.scss';

// EN / ES segmented toggle, backed by the shared i18n layer.
export function LanguageToggle() {
  const { lang, toggle } = useLang();
  return (
    <button
      className="lvx-lang-toggle"
      type="button"
      onClick={toggle}
      aria-label="Switch language / Cambiar idioma"
    >
      <span className={lang === 'en' ? 'is-on' : ''}>EN</span>
      <span className={lang === 'es' ? 'is-on' : ''}>ES</span>
    </button>
  );
}
