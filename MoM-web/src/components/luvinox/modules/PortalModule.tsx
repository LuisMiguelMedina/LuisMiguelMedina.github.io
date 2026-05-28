import { Link } from 'react-router-dom';

type PortalModuleProps = {
  label: string;
  route: string;
};

export function PortalModule({ label, route }: PortalModuleProps) {
  return (
    <Link className="luvinox-portal" to={route}>
      <span>{label}</span>
      <span className="luvinox-portal-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
