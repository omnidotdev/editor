import { IndexeddbPersistence } from "y-indexeddb";
import type { Doc as YDoc } from "yjs";
type CreatePersistenceOptions = {
    /** IndexedDB database key prefix. The full key is `${keyPrefix}${documentId}` */
    keyPrefix?: string;
};
/**
 * Create an IndexedDB persistence layer for a given document.
 * @param documentId - Document identifier
 * @param ydoc - Y.Doc to persist
 * @param options - Persistence configuration
 * @returns IndexeddbPersistence instance
 */
export declare const createPersistence: (documentId: string, ydoc: YDoc, { keyPrefix }?: CreatePersistenceOptions) => IndexeddbPersistence;
export {};
//# sourceMappingURL=createPersistence.d.ts.map