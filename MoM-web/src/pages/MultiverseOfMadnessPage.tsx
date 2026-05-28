import { SectionHeading } from '../components/SectionHeading';
import { TeamMemberCard } from '../components/TeamMemberCard';
import {
  cultureItems,
  partnershipHighlights,
  studioStats,
  teamMembers,
  workflowSteps,
} from '../data/team';

export function MultiverseOfMadnessPage() {
  const leadMember = teamMembers[0];

  return (
    <div id="top" className="app-shell">
      <header className="hero-section">
        <div className="hero-orb hero-orb-primary" />
        <div className="hero-orb hero-orb-secondary" />

        <nav className="navbar navbar-expand-lg py-4 position-relative">
          <div className="container">
            <a className="navbar-brand brand-mark text-white" href="#top">
              MoM Collective
            </a>

            <div className="ms-auto d-flex flex-wrap gap-2 align-items-center justify-content-end">
              <a className="btn nav-chip" href="#team">
                Our Team
              </a>
              <a className="btn nav-chip" href="#culture">
                Culture
              </a>
              <a className="btn nav-chip" href="#join">
                Join Us
              </a>
              <a
                className="btn btn-warning rounded-pill px-4 fw-semibold"
                href="mailto:team@multiverseofmadness.me?subject=Let%27s%20build%20together"
              >
                Book a call
              </a>
            </div>
          </div>
        </nav>

        <div className="container hero-content position-relative">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="hero-kicker">Bootstrap foundations, React delivery</span>
              <h1 className="display-2 hero-title">Our Team</h1>
              <p className="hero-copy mb-0">
                A compact senior squad built to move from ambiguity to shipping without losing
                craft. We blend strategy, interface design, front-end execution, and delivery
                operations into one steady rhythm.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <a className="btn btn-warning btn-lg rounded-pill px-4 fw-semibold" href="#team">
                  Meet the crew
                </a>
                <a className="btn btn-outline-light btn-lg rounded-pill px-4" href="#culture">
                  How we work
                </a>
              </div>

              <div className="row g-3 mt-4">
                {studioStats.map((item) => (
                  <div className="col-sm-4" key={item.label}>
                    <div className="metric-tile">
                      <div className="metric-value">{item.value}</div>
                      <div className="metric-label">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="lead-panel">
                <div className="lead-panel-head">
                  <span className="status-dot" />
                  Featured team lead
                </div>

                <div className="d-flex align-items-center gap-3 mb-4">
                  <img
                    className="lead-avatar"
                    src={leadMember.avatar}
                    alt={leadMember.name}
                    loading="lazy"
                  />

                  <div>
                    <h2 className="lead-name h3">{leadMember.name}</h2>
                    <p className="lead-role">{leadMember.role}</p>
                    <p className="text-white-50 mb-0">{leadMember.location}</p>
                  </div>
                </div>

                <p className="hero-copy mb-4">{leadMember.bio}</p>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  {leadMember.highlights.map((highlight) => (
                    <span className="member-pill" key={highlight}>
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="lead-note">
                  We keep discovery, design reviews, and front-end delivery in the same loop so
                  decisions are visible and handoffs stay short.
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="team" className="section-shell">
          <div className="container">
            <SectionHeading
              eyebrow="Core Crew"
              title="Small enough to stay sharp, cross-functional enough to keep momentum."
              description="Each person owns a specialty and overlaps with another discipline, so design, engineering and delivery stay synchronized from kickoff to release."
            />

            <div className="row g-4">
              {teamMembers.map((member) => (
                <div className="col-md-6 col-xl-4" key={member.name}>
                  <TeamMemberCard member={member} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="culture" className="section-shell section-shell-muted">
          <div className="container position-relative">
            <div className="row g-4 align-items-end mb-4">
              <div className="col-lg-7">
                <SectionHeading
                  eyebrow="Operating System"
                  title="Built on clear rituals, high trust, and visible ownership."
                  description="We use lightweight routines to keep work honest: brief discovery, crisp design critiques, and a delivery cadence every stakeholder can follow."
                />
              </div>

              <div className="col-lg-5">
                <div className="culture-cloud">
                  {cultureItems.map((item) => (
                    <span className="culture-pill" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="row g-4">
              {workflowSteps.map((step) => (
                <div className="col-md-4" key={step.title}>
                  <article className="workflow-card">
                    <span className="workflow-index">{step.index}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell">
          <div className="container">
            <div className="row g-4 align-items-center">
              <div className="col-lg-5">
                <SectionHeading
                  eyebrow="Partnership Model"
                  title="A team page should also explain what collaboration feels like."
                  description="This crew plugs into product organizations as a steady extension, not as a black-box vendor. We document decisions, protect release quality, and keep timelines realistic."
                />
              </div>

              <div className="col-lg-7">
                <div className="row g-4">
                  {partnershipHighlights.map((item) => (
                    <div className="col-sm-6" key={item.title}>
                      <article className="highlight-panel">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="join" className="section-shell section-shell-compact">
          <div className="container">
            <div className="cta-panel">
              <div className="row align-items-center g-4">
                <div className="col-lg-8">
                  <span className="hero-kicker hero-kicker-secondary">
                    Ready to assemble the right crew?
                  </span>
                  <h2 className="cta-title">
                    We build teams around clarity, pace, and accountable delivery.
                  </h2>
                  <p className="cta-copy mb-0">
                    If you need product strategy, interface design, and implementation moving in
                    the same direction, this page is now the front door for that story.
                  </p>
                </div>

                <div className="col-lg-4">
                  <div className="d-grid gap-3">
                    <a
                      className="btn btn-warning btn-lg rounded-pill fw-semibold"
                      href="mailto:team@multiverseofmadness.me?subject=We%20want%20to%20work%20with%20your%20team"
                    >
                      Start a conversation
                    </a>
                    <a className="btn btn-outline-light btn-lg rounded-pill" href="#top">
                      Back to top
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
