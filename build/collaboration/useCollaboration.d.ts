import type { HocuspocusProvider } from "@hocuspocus/provider";
import type { Doc as YDoc } from "yjs";
type UseCollaborationOptions = {
    /** Document identifier. Pass null to tear down the active session */
    documentId: string | null;
    /** Hocuspocus server URL (required when cloud sync is enabled) */
    url: string;
    /** Async token provider used to authenticate the connection */
    getToken: () => Promise<string>;
    /**
     * Maps a documentId to the Hocuspocus room name. Defaults to `doc:${id}`.
     * Pass a stable function (memoized) to avoid reconnecting the provider.
     */
    documentName?: (documentId: string) => string;
    /** Whether to connect to the Hocuspocus server (cloud sync) */
    cloudEnabled?: boolean;
    /** Persistence configuration (e.g. IndexedDB key prefix) */
    persistence?: {
        keyPrefix?: string;
    };
    /**
     * Called whenever the number of remote peers changes.
     * Excludes the local client. Called with 0 on disconnect/teardown.
     */
    onPeerCountChange?: (peerCount: number) => void;
};
type UseCollaborationResult = {
    ydoc: YDoc | null;
    provider: HocuspocusProvider | null;
    isLocalSynced: boolean;
    isRemoteSynced: boolean;
    isSyncing: boolean;
    peerCount: number;
};
/**
 * React hook that orchestrates Y.Doc, IndexedDB persistence,
 * and Hocuspocus WebSocket provider for a given document.
 */
declare const useCollaboration: ({ documentId, url, getToken, documentName, cloudEnabled, persistence, onPeerCountChange, }: UseCollaborationOptions) => UseCollaborationResult;
export default useCollaboration;
//# sourceMappingURL=useCollaboration.d.ts.map