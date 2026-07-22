// Core data model for the heyi-portal career canvas.
// All UI text is stored as LocaleText so the viewer can switch languages
// without re-fetching or re-rendering unrelated components.

export type LocaleCode = "en" | "zhHans" | "zhHant";

export type LocaleText = {
  en: string;
  zhHans: string;
  zhHant: string;
};

export type SkillId = string;

export type SkillTrackId = "llm-ai" | "ai-vision" | "software-data" | "iot-device";

export type SkillFilter =
  | { kind: "track"; id: SkillTrackId }
  | { kind: "skill"; id: SkillId }
  | null;

export type SkillCategory =
  | "language"
  | "ai"
  | "ml"
  | "web"
  | "data"
  | "robotics"
  | "iot"
  | "tool"
  | "business"
  | "communication";

export type Skill = {
  id: SkillId;
  label: LocaleText;
  category: SkillCategory;
};

export type SkillTrack = {
  id: SkillTrackId;
  label: LocaleText;
  keywords: LocaleText[];
};

export type CardGroup = "profile" | "education" | "internship" | "project";

export type CardEmphasis = "primary" | "normal" | "secondary";

export type CardLink = {
  label: LocaleText;
  url: string;
};

export type DetailMedia = {
  src: string;
  alt: LocaleText;
  caption?: LocaleText;
};

export type DetailGroup = {
  id: string;
  title: LocaleText;
  items: LocaleText[];
};

export type ProjectMetric = {
  id: string;
  value: LocaleText;
  label: LocaleText;
  note: LocaleText;
  tooltip?: LocaleText;
};

export type DetailSectionVariant =
  | "standard"
  | "hero"
  | "process"
  | "comparison"
  | "metrics"
  | "cards"
  | "stack";

export type DetailSection = {
  id: string;
  title: LocaleText;
  variant?: DetailSectionVariant;
  callout?: LocaleText;
  paragraphs?: LocaleText[];
  items?: LocaleText[];
  metrics?: LocaleText[];
  projectMetrics?: ProjectMetric[];
  groups?: DetailGroup[];
  links?: CardLink[];
  media?: DetailMedia[];
};

export type FeaturedProject = {
  category: LocaleText;
  ownership: LocaleText;
  cardMetrics: ProjectMetric[];
  detailMetrics: ProjectMetric[];
  featuredSkillIds: SkillId[];
};

export type Card = {
  id: string;
  group: CardGroup;

  title: LocaleText;
  subtitle?: LocaleText;
  role?: LocaleText;

  timeLabel: LocaleText;
  startDate?: string;
  endDate?: string;

  summary: LocaleText;

  details: {
    overview: LocaleText;
    whatIDid: LocaleText[];
    technicalDecisions?: LocaleText[];
    outcomes?: LocaleText[];
    tech?: LocaleText;
    links?: CardLink[];
    sections?: DetailSection[];
  };

  featuredProject?: FeaturedProject;

  skills: SkillId[];
  trackIds: SkillTrackId[];

  position: {
    x: number;
    y: number;
  };

  size: {
    width: number;
    height: number;
  };

  emphasis?: CardEmphasis;
};

export type ConnectionType =
  | "profile-to-group"
  | "sequence"
  | "related"
  | "fyp"
  | "skill";

export type Connection = {
  id: string;
  from: string;
  to: string;
  type: ConnectionType;
  label?: LocaleText;
};

export type PortfolioMeta = {
  name: LocaleText;
  displayName: LocaleText;
  tagline: LocaleText;
  defaultLocale: LocaleCode;
};

export type PortfolioProfile = {
  email: string;
  github: string;
  linkedin?: string;
  cvUrl?: string;
  location: LocaleText;
};

export type Portfolio = {
  meta: PortfolioMeta;
  profile: PortfolioProfile;
  skills: Skill[];
  skillTracks: SkillTrack[];
  cards: Card[];
  connections: Connection[];
};
