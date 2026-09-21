type ClassInput = string | number | false | null | undefined;

/**
 * Minimal class-name joiner. Filters falsy values and joins with a space.
 * Kept dependency-free so the package stays headless and framework-agnostic.
 */
export const cn = (...inputs: ClassInput[]): string =>
  inputs.filter(Boolean).join(" ");
