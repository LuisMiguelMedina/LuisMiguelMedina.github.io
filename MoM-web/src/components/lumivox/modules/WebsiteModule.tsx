import { useLang } from '../../../i18n';

type WebsiteModuleProps = {
  url: string;
  label?: string;
};

export function WebsiteModule({ url, label }: WebsiteModuleProps) {
  const { t } = useLang();
  return (
    <a
      className="lumivox-website"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>{t(label ?? 'cta.website')}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
