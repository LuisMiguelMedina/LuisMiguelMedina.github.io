type BriefModuleProps = {
  body: string;
};

export function BriefModule({ body }: BriefModuleProps) {
  return <p className="luvinox-brief">{body}</p>;
}
