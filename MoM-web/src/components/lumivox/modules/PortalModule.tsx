import { Link } from 'react-router-dom';
import { useLang } from '../../../i18n';

type PortalModuleProps = {
  label: string;
  route: string;
};

export function PortalModule({ label, route }: PortalModuleProps) {
  const { t } = useLang();
  return (
    <Link className="lumivox-portal" to={route}>
      <span>{t(label)}</span>
      <span className="lumivox-portal-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
