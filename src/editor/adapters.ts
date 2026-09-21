/**
 * Authentication seam for collaborative sessions. Consumers implement this to
 * supply a bearer token to the Hocuspocus provider, keeping the package free of
 * any product-specific auth client.
 */
export interface AuthAdapter {
  /** Resolve a fresh auth token used to authenticate the collab connection */
  getToken: () => Promise<string>;
}

/**
 * Asset storage seam for image and binary uploads. Consumers implement this to
 * persist assets in their own backend (object storage, a vault, etc.) and to
 * resolve stored references back to displayable URLs. Injected by the consuming
 * product; the package ships no concrete storage implementation.
 */
export interface AssetStorageAdapter {
  /**
   * Persist a binary asset and return a URL or reference that can be used as an
   * image `src`.
   * @param file - The asset to store
   */
  upload: (file: File) => Promise<string>;
  /**
   * Optionally resolve a stored asset reference to a displayable URL.
   * @param src - The stored reference
   */
  resolve?: (src: string) => string | Promise<string>;
}
