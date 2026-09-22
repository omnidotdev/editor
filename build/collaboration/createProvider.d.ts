import { HocuspocusProvider } from "@hocuspocus/provider";
import type { Doc as YDoc } from "yjs";
type CreateProviderOptions = {
    documentId: string;
    ydoc: YDoc;
    /** Hocuspocus server URL (e.g. wss://collab.example.com) */
    url: string;
    /** Async token provider used to authenticate the connection */
    getToken: () => Promise<string>;
    /**
     * Derive the Hocuspocus document name from the document id.
     * @default (id) => `doc:${id}`
     */
    documentName?: (documentId: string) => string;
};
/**
 * Create a Hocuspocus provider for a given document.
 * @param options - Provider configuration
 * @returns Configured HocuspocusProvider instance
 */
export declare const createProvider: ({ documentId, ydoc, url, getToken, documentName, }: CreateProviderOptions) => HocuspocusProvider;
export {};
//# sourceMappingURL=createProvider.d.ts.map