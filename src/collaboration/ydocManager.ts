import * as Y from "yjs";

/**
 * Singleton Y.Doc manager for active documents.
 * Manages the lifecycle of Y.Doc instances keyed by note ID.
 */
const docs = new Map<string, Y.Doc>();

/**
 * Get an existing Y.Doc or create a new one for the given note.
 * @param noteId - Note identifier
 */
export const getOrCreateDoc = (noteId: string): Y.Doc => {
  const existing = docs.get(noteId);
  if (existing) return existing;

  const doc = new Y.Doc();
  docs.set(noteId, doc);
  return doc;
};

/**
 * Destroy and remove a Y.Doc from the manager.
 * @param noteId - Note identifier
 */
export const destroyDoc = (noteId: string): void => {
  const doc = docs.get(noteId);
  if (!doc) return;

  doc.destroy();
  docs.delete(noteId);
};

/**
 * Check if a Y.Doc exists for the given note.
 * @param noteId - Note identifier
 */
export const hasDoc = (noteId: string): boolean => docs.has(noteId);
