import type { TeamMember } from '../data/team';

type TeamMemberCardProps = {
  member: TeamMember;
};

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <article className="team-card">
      <div className="d-flex align-items-center gap-3 mb-4">
        <img
          className="member-avatar"
          src={member.avatar}
          alt={member.name}
          loading="lazy"
        />

        <div>
          <h3 className="member-name h4">{member.name}</h3>
          <p className="member-role">{member.role}</p>
        </div>
      </div>

      <p className="member-focus">{member.focus}</p>
      <p className="member-bio">{member.bio}</p>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {member.highlights.map((highlight) => (
          <span className="member-pill" key={highlight}>
            {highlight}
          </span>
        ))}
      </div>

      <div className="member-meta">
        <span>{member.location}</span>
        <span>{member.availability}</span>
      </div>
    </article>
  );
}