export type TeamMember = {
  name: string;
  role: string;
  focus: string;
  location: string;
  bio: string;
  avatar: string;
  availability: string;
  highlights: string[];
};

type Stat = {
  value: string;
  label: string;
};

type WorkflowStep = {
  index: string;
  title: string;
  description: string;
};

type Highlight = {
  title: string;
  description: string;
};

export const studioStats: Stat[] = [
  { value: '05', label: 'Senior specialists' },
  { value: '12+', label: 'Product launches' },
  { value: '72h', label: 'Average sprint response' },
];

export const teamMembers: TeamMember[] = [
  {
    name: 'Alicia Vega',
    role: 'Product Lead',
    focus: 'Discovery, scope shaping, and decision alignment.',
    location: 'Madrid, Spain',
    bio: 'Turns ambiguity into a roadmap teams can actually execute without inflating timelines or burning trust.',
    avatar: '/team-media/avatar1.jpeg',
    availability: 'Available for strategy sprints',
    highlights: ['Stakeholder workshops', 'Roadmap clarity', 'Launch orchestration'],
  },
  {
    name: 'Mateo Cruz',
    role: 'Design Director',
    focus: 'Interface systems, narrative layouts, and usability reviews.',
    location: 'Bogota, Colombia',
    bio: 'Builds design systems that look intentional, scale cleanly, and remain legible under product pressure.',
    avatar: '/team-media/avatar2.jpeg',
    availability: 'Leading visual systems',
    highlights: ['Design systems', 'Experience audits', 'Prototype reviews'],
  },
  {
    name: 'Nora Salas',
    role: 'Front-end Engineer',
    focus: 'React architecture, component quality, and accessible UI delivery.',
    location: 'Monterrey, Mexico',
    bio: 'Connects motion, state, and implementation detail so polished ideas survive the trip into production.',
    avatar: '/team-media/avatar3.jpeg',
    availability: 'Shipping the React stack',
    highlights: ['Component architecture', 'Accessibility', 'Performance budgets'],
  },
  {
    name: 'Diego Marin',
    role: 'Technical PM',
    focus: 'Delivery planning, sprint cadence, and execution visibility.',
    location: 'Lima, Peru',
    bio: 'Keeps cross-functional work moving with realistic sequencing, clear owners, and release confidence.',
    avatar: '/team-media/avatar4.jpeg',
    availability: 'Managing release flow',
    highlights: ['Sprint health', 'Release planning', 'Risk control'],
  },
  {
    name: 'Elena Duarte',
    role: 'Content Strategist',
    focus: 'Brand voice, conversion messaging, and editorial clarity.',
    location: 'Buenos Aires, Argentina',
    bio: 'Shapes the words around the product so positioning feels precise, human, and conversion-ready.',
    avatar: '/team-media/avatar5.jpeg',
    availability: 'Crafting launch narratives',
    highlights: ['Messaging systems', 'Conversion copy', 'Editorial QA'],
  },
];

export const cultureItems: string[] = [
  'Fast feedback loops',
  'Senior-only delivery',
  'Visible decisions',
  'Design critique rituals',
  'Lean documentation',
  'Release accountability',
];

export const workflowSteps: WorkflowStep[] = [
  {
    index: '01',
    title: 'Listen before we prescribe',
    description:
      'We begin with user context, team constraints, and business pressure so the plan reflects reality instead of theory.',
  },
  {
    index: '02',
    title: 'Design in public',
    description:
      'Concepts, UI states, and implementation tradeoffs stay visible, which keeps reviews fast and avoids surprise handoffs.',
  },
  {
    index: '03',
    title: 'Ship with accountability',
    description:
      'Every release closes with measurable outcomes, cleanup notes, and a clear owner for the next iteration.',
  },
];

export const partnershipHighlights: Highlight[] = [
  {
    title: 'Embedded collaboration',
    description:
      'We behave like an internal strike team that can plug into product, marketing, or engineering without extra ceremony.',
  },
  {
    title: 'Tighter handoffs',
    description:
      'Design notes, implementation choices, and release priorities stay in one place so context does not fragment.',
  },
  {
    title: 'Senior decision-making',
    description:
      'The team is intentionally compact, which means fewer approval layers and faster calls when plans need to shift.',
  },
  {
    title: 'Delivery with polish',
    description:
      'We protect the finish of the work, from responsive details and motion to the narrative around launch day.',
  },
];