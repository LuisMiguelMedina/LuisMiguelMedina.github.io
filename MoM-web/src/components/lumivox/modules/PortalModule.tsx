import { Link } from 'react-router-dom';
import { useLang } from '../../../i18n';

type PortalModuleProps = {
  label: string;
  route: string;
};

export function PortalModule({ label, route }: PortalModuleProps) {
  const { t } = useLang();
  // `route` may be an internal router path or an external URL (http…). External
  // links open in a new tab; internal ones use the SPA router.
  const isExternal = /^https?:\/\//.test(route);
  const inner = (
    <>
      <span>{t(label)}</span>
      <span className="lumivox-portal-arrow" aria-hidden="true">
        →
      </span>
    </>
  );

  return isExternal ? (
    <a className="lumivox-portal" href={route} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link className="lumivox-portal" to={route}>
      {inner}
    </Link>
  );
}
