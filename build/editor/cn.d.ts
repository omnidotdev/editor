type ClassInput = string | number | false | null | undefined;
/**
 * Minimal class-name joiner. Filters falsy values and joins with a space.
 * Kept dependency-free so the package stays headless and framework-agnostic.
 */
export declare const cn: (...inputs: ClassInput[]) => string;
export {};
//# sourceMappingURL=cn.d.ts.map