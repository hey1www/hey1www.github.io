function normalizeVisibleText(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/[\s.,，。:：;；·・/\\|()（）[\]【】\-–—_]+/g, "");
}

export function isDuplicateLine(
  line: string,
  candidates: Array<string | undefined>
): boolean {
  const current = normalizeVisibleText(line);
  if (!current) return true;
  return candidates.some((candidate) => {
    const other = normalizeVisibleText(candidate ?? "");
    if (!other) return false;
    return other === current || (current.length >= 4 && other.includes(current));
  });
}

export function visibleSummary(
  summary: string,
  title?: string,
  subtitle?: string,
  role?: string
): string | null {
  return isDuplicateLine(summary, [title, subtitle, role]) ? null : summary;
}
