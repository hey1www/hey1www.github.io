// Backwards-compatible hook: prefer useLocaleContext from LocaleContext.ts,
// but keep useLocale returning the same shape so existing imports work.
import { useLocaleContext } from "./LocaleContext";

export function useLocale() {
  return useLocaleContext();
}