import { Link } from 'react-router-dom';
import { DayMark, NightMark } from './LumivoxLogo';
import { useTheme } from './ThemeContext';
import './LumivoxBrand.scss';

// Brand logo that swaps the day sun ↔ night monogram with the theme (like the
// homepage) and links back to /home. The wordmark color is inherited, so each
// page sets it to suit its background.
export function LumivoxBrand() {
  const { theme } = useTheme();
  return (
    <Link className="lvx-brand-logo" to="/home" data-theme={theme} aria-label="Lumivox — inicio">
      <span className="lvx-brand-marks">
        <DayMark />
        <NightMark />
      </span>
      <span className="lvx-brand-word">lumivox</span>
    </Link>
  );
}
