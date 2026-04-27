/**
 * Default public name is OpenKotOR (e.g. openkotor.com, GitHub Pages).
 * For the Hugging Face static mirror (org OldRepublicDevs), CI sets
 * VITE_HF_PUBLIC_BRAND=Old Republic Devs at build time.
 */
export const SITE_BRAND =
  (import.meta.env.VITE_HF_PUBLIC_BRAND as string | undefined)?.trim() || "OpenKotOR";

export const SITE_TAGLINE = "Modding & Reverse‑Engineering Hub";

export function defaultPageTitle(): string {
  return `${SITE_BRAND} — ${SITE_TAGLINE}`;
}
