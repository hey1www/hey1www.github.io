import type { LocaleCode, LocaleText, Portfolio } from "../types/portfolio";

const REQUIRED_LOCALES: LocaleCode[] = ["en", "zhHans", "zhHant"];
const CARD_GROUPS = new Set(["profile", "education", "internship", "project"]);
const SKILL_TRACK_IDS = new Set(["llm-ai", "ai-vision", "software-data", "iot-device"]);
const DETAIL_SECTION_VARIANTS = new Set([
  "standard",
  "hero",
  "process",
  "comparison",
  "metrics",
  "cards",
  "stack",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasLocaleText(value: unknown): value is LocaleText {
  if (!isRecord(value)) return false;
  return REQUIRED_LOCALES.every((locale) => typeof value[locale] === "string" && value[locale] !== "");
}

function validateProjectMetric(metric: unknown, context: string, errors: string[]) {
  if (
    !isRecord(metric) ||
    typeof metric.id !== "string" ||
    !metric.id ||
    !hasLocaleText(metric.value) ||
    !hasLocaleText(metric.label) ||
    !hasLocaleText(metric.note) ||
    (metric.tooltip !== undefined && !hasLocaleText(metric.tooltip))
  ) {
    errors.push(`${context} has an invalid project metric.`);
  }
}

export type PortfolioValidationResult =
  | { ok: true; value: Portfolio; errors: [] }
  | { ok: false; value: null; errors: string[] };

export function validatePortfolio(value: unknown): PortfolioValidationResult {
  const errors: string[] = [];
  if (!isRecord(value)) {
    return { ok: false, value: null, errors: ["Portfolio must be an object."] };
  }

  const skills = Array.isArray(value.skills) ? value.skills : [];
  const skillTracks = Array.isArray(value.skillTracks) ? value.skillTracks : [];
  const cards = Array.isArray(value.cards) ? value.cards : [];
  const connections = Array.isArray(value.connections) ? value.connections : [];

  if (!hasLocaleText(value.meta && isRecord(value.meta) ? value.meta.name : null)) {
    errors.push("meta.name must include en, zhHans, and zhHant.");
  }
  if (!isRecord(value.profile) || typeof value.profile.email !== "string") {
    errors.push("profile.email is required.");
  }
  if (!skills.length) errors.push("skills must be a non-empty array.");
  if (!skillTracks.length) errors.push("skillTracks must be a non-empty array.");
  if (!cards.length) errors.push("cards must be a non-empty array.");
  if (!Array.isArray(value.connections)) errors.push("connections must be an array.");

  const skillIds = new Set<string>();
  for (const skill of skills) {
    if (!isRecord(skill) || typeof skill.id !== "string" || !skill.id) {
      errors.push("Every skill must have a non-empty id.");
      continue;
    }
    if (skillIds.has(skill.id)) errors.push(`Duplicate skill id: ${skill.id}`);
    skillIds.add(skill.id);
    if (!hasLocaleText(skill.label)) errors.push(`Skill ${skill.id} is missing locale labels.`);
  }

  const cardIds = new Set<string>();
  const trackIds = new Set<string>();
  for (const track of skillTracks) {
    if (!isRecord(track) || typeof track.id !== "string" || !SKILL_TRACK_IDS.has(track.id)) {
      errors.push("Every skill track must have a valid stable id.");
      continue;
    }
    if (trackIds.has(track.id)) errors.push(`Duplicate skill track id: ${track.id}`);
    trackIds.add(track.id);
    if (!hasLocaleText(track.label)) errors.push(`Skill track ${track.id} is missing locale labels.`);
    const keywords = Array.isArray(track.keywords) ? track.keywords : [];
    if (!keywords.length || keywords.some((keyword) => !hasLocaleText(keyword))) {
      errors.push(`Skill track ${track.id} has invalid keywords.`);
    }
  }

  for (const card of cards) {
    if (!isRecord(card) || typeof card.id !== "string" || !card.id) {
      errors.push("Every card must have a non-empty id.");
      continue;
    }
    if (cardIds.has(card.id)) errors.push(`Duplicate card id: ${card.id}`);
    cardIds.add(card.id);
    if (typeof card.group !== "string" || !CARD_GROUPS.has(card.group)) {
      errors.push(`Card ${card.id} has invalid group.`);
    }
    if (!hasLocaleText(card.title)) errors.push(`Card ${card.id} is missing title locale text.`);
    if (!hasLocaleText(card.timeLabel)) errors.push(`Card ${card.id} is missing timeLabel locale text.`);
    if (!hasLocaleText(card.summary)) errors.push(`Card ${card.id} is missing summary locale text.`);
    if (!isRecord(card.details) || !hasLocaleText(card.details.overview)) {
      errors.push(`Card ${card.id} is missing details.overview locale text.`);
    }
    if (!isRecord(card.position) || typeof card.position.x !== "number" || typeof card.position.y !== "number") {
      errors.push(`Card ${card.id} has invalid position.`);
    }
    if (!isRecord(card.size) || typeof card.size.width !== "number" || typeof card.size.height !== "number") {
      errors.push(`Card ${card.id} has invalid size.`);
    }
    const cardSkills = Array.isArray(card.skills) ? card.skills : [];
    for (const skillId of cardSkills) {
      if (typeof skillId !== "string" || !skillIds.has(skillId)) {
        errors.push(`Card ${card.id} references unknown skill: ${String(skillId)}`);
      }
    }
    const cardTrackIds = Array.isArray(card.trackIds) ? card.trackIds : [];
    for (const trackId of cardTrackIds) {
      if (typeof trackId !== "string" || !trackIds.has(trackId)) {
        errors.push(`Card ${card.id} references unknown skill track: ${String(trackId)}`);
      }
    }
    if (card.featuredProject !== undefined) {
      const featured = card.featuredProject;
      if (
        !isRecord(featured) ||
        !hasLocaleText(featured.category) ||
        !hasLocaleText(featured.ownership) ||
        !Array.isArray(featured.cardMetrics) ||
        featured.cardMetrics.length !== 3 ||
        !Array.isArray(featured.detailMetrics) ||
        featured.detailMetrics.length !== 4 ||
        !Array.isArray(featured.featuredSkillIds) ||
        featured.featuredSkillIds.length !== 5
      ) {
        errors.push(`Card ${card.id} has invalid featuredProject data.`);
      } else {
        featured.cardMetrics.forEach((metric) =>
          validateProjectMetric(metric, `Card ${card.id} featuredProject.cardMetrics`, errors)
        );
        featured.detailMetrics.forEach((metric) =>
          validateProjectMetric(metric, `Card ${card.id} featuredProject.detailMetrics`, errors)
        );
        for (const skillId of featured.featuredSkillIds) {
          if (typeof skillId !== "string" || !skillIds.has(skillId)) {
            errors.push(`Card ${card.id} featuredProject references unknown skill: ${String(skillId)}`);
          }
        }
      }
    }
    const links = isRecord(card.details) && Array.isArray(card.details.links) ? card.details.links : [];
    for (const link of links) {
      if (!isRecord(link) || typeof link.url !== "string" || !link.url || !hasLocaleText(link.label)) {
        errors.push(`Card ${card.id} has an invalid link.`);
      }
    }
    const sections = isRecord(card.details) && Array.isArray(card.details.sections)
      ? card.details.sections
      : [];
    for (const section of sections) {
      if (!isRecord(section) || typeof section.id !== "string" || !section.id || !hasLocaleText(section.title)) {
        errors.push(`Card ${card.id} has an invalid detail section.`);
        continue;
      }
      if (
        section.variant !== undefined &&
        (typeof section.variant !== "string" || !DETAIL_SECTION_VARIANTS.has(section.variant))
      ) {
        errors.push(`Card ${card.id} section ${section.id} has an invalid variant.`);
      }
      if (section.callout !== undefined && !hasLocaleText(section.callout)) {
        errors.push(`Card ${card.id} section ${section.id} has an invalid callout.`);
      }
      for (const field of ["paragraphs", "items", "metrics"] as const) {
        const entries = Array.isArray(section[field]) ? section[field] : [];
        if (entries.some((entry) => !hasLocaleText(entry))) {
          errors.push(`Card ${card.id} section ${section.id} has invalid ${field}.`);
        }
      }
      const projectMetrics = Array.isArray(section.projectMetrics) ? section.projectMetrics : [];
      projectMetrics.forEach((metric) =>
        validateProjectMetric(metric, `Card ${card.id} section ${section.id}`, errors)
      );
      const groups = Array.isArray(section.groups) ? section.groups : [];
      for (const group of groups) {
        if (
          !isRecord(group) ||
          typeof group.id !== "string" ||
          !group.id ||
          !hasLocaleText(group.title) ||
          !Array.isArray(group.items) ||
          !group.items.length ||
          group.items.some((item) => !hasLocaleText(item))
        ) {
          errors.push(`Card ${card.id} section ${section.id} has an invalid group.`);
        }
      }
      const sectionLinks = Array.isArray(section.links) ? section.links : [];
      for (const link of sectionLinks) {
        if (!isRecord(link) || typeof link.url !== "string" || !link.url || !hasLocaleText(link.label)) {
          errors.push(`Card ${card.id} section ${section.id} has an invalid link.`);
        }
      }
      const media = Array.isArray(section.media) ? section.media : [];
      for (const item of media) {
        if (!isRecord(item) || typeof item.src !== "string" || !item.src || !hasLocaleText(item.alt)) {
          errors.push(`Card ${card.id} section ${section.id} has invalid media.`);
        }
      }
    }
  }

  for (const connection of connections) {
    if (!isRecord(connection) || typeof connection.id !== "string") {
      errors.push("Every connection must have an id.");
      continue;
    }
    if (typeof connection.from !== "string" || !cardIds.has(connection.from)) {
      errors.push(`Connection ${connection.id} has invalid from card.`);
    }
    if (typeof connection.to !== "string" || !cardIds.has(connection.to)) {
      errors.push(`Connection ${connection.id} has invalid to card.`);
    }
  }

  if (errors.length) return { ok: false, value: null, errors };
  return { ok: true, value: value as Portfolio, errors: [] };
}
