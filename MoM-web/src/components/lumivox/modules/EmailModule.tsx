import { useLang } from '../../../i18n';

// Reusable "contact by email" CTA. Any artist can add a { kind: 'email' } module;
// the label is an i18n key (defaults to cta.contact) so it follows EN/ES.
type EmailModuleProps = {
  address: string;
  label?: string;
};

export function EmailModule({ address, label }: EmailModuleProps) {
  const { t } = useLang();
  return (
    <a className="lumivox-email" href={`mailto:${address}`}>
      <span className="lumivox-email-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      </span>
      <span>{t(label ?? 'cta.contact')}</span>
    </a>
  );
}
