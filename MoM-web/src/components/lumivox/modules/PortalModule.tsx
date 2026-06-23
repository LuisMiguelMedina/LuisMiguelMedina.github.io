import { Link } from 'react-router-dom';

type PortalModuleProps = {
  label: string;
  route: string;
};

export function PortalModule({ label, route }: PortalModuleProps) {
  return (
    <Link className="lumivox-portal" to={route}>
      <span>{label}</span>
      <span className="lumivox-portal-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
