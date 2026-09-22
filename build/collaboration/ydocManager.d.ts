import * as Y from "yjs";
/**
 * Get an existing Y.Doc or create a new one for the given note.
 * @param noteId - Note identifier
 */
export declare const getOrCreateDoc: (noteId: string) => Y.Doc;
/**
 * Destroy and remove a Y.Doc from the manager.
 * @param noteId - Note identifier
 */
export declare const destroyDoc: (noteId: string) => void;
/**
 * Check if a Y.Doc exists for the given note.
 * @param noteId - Note identifier
 */
export declare const hasDoc: (noteId: string) => boolean;
//# sourceMappingURL=ydocManager.d.ts.map