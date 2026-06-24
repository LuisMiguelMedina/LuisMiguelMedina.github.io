import { useLang } from '../../../i18n';

type BriefModuleProps = {
  body: string;
};

export function BriefModule({ body }: BriefModuleProps) {
  const { t } = useLang();
  return <p className="lumivox-brief">{t(body)}</p>;
}
