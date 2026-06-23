type BriefModuleProps = {
  body: string;
};

export function BriefModule({ body }: BriefModuleProps) {
  return <p className="lumivox-brief">{body}</p>;
}
