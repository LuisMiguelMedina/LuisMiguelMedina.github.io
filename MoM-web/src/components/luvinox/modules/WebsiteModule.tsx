type WebsiteModuleProps = {
  url: string;
  label?: string;
};

export function WebsiteModule({ url, label }: WebsiteModuleProps) {
  return (
    <a
      className="luvinox-website"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>{label ?? 'Visit website'}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
