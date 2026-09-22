import { useCallback, useEffect, useRef, useState } from "react";

import { createPersistence } from "./createPersistence";
import { createProvider } from "./createProvider";
import { destroyDoc, getOrCreateDoc } from "./ydocManager";

import type { HocuspocusProvider } from "@hocuspocus/provider";
import type { IndexeddbPersistence } from "y-indexeddb";
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
const useCollaboration = ({
  documentId,
  url,
  getToken,
  documentName,
  cloudEnabled = false,
  persistence,
  onPeerCountChange,
}: UseCollaborationOptions): UseCollaborationResult => {
  const [isLocalSynced, setIsLocalSynced] = useState(false);
  const [isRemoteSynced, setIsRemoteSynced] = useState(false);
  const [peerCount, setPeerCount] = useState(0);
  // Store ydoc and provider in state (not refs) so changes trigger re-renders
  const [ydoc, setYdoc] = useState<YDoc | null>(null);
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

  const providerRef = useRef<HocuspocusProvider | null>(null);
  const persistenceRef = useRef<IndexeddbPersistence | null>(null);
  // Track the active documentId for cleanup (don't rely on Y.Doc guid)
  const activeDocumentIdRef = useRef<string | null>(null);

  // Keep the latest peer-count callback without re-running the effect
  const onPeerCountChangeRef = useRef(onPeerCountChange);
  onPeerCountChangeRef.current = onPeerCountChange;

  const updatePeerCount = useCallback((count: number) => {
    setPeerCount(count);
    onPeerCountChangeRef.current?.(count);
  }, []);

  const cleanup = useCallback(() => {
    updatePeerCount(0);

    providerRef.current?.destroy();
    providerRef.current = null;

    persistenceRef.current?.destroy();
    persistenceRef.current = null;

    if (activeDocumentIdRef.current) {
      destroyDoc(activeDocumentIdRef.current);
      activeDocumentIdRef.current = null;
    }

    setYdoc(null);
    setProvider(null);
    setIsLocalSynced(false);
    setIsRemoteSynced(false);
  }, [updatePeerCount]);

  useEffect(() => {
    if (!documentId) {
      cleanup();
      return;
    }

    // Create Y.Doc
    const doc = getOrCreateDoc(documentId);
    activeDocumentIdRef.current = documentId;
    setYdoc(doc);

    // Set up IndexedDB persistence
    const localPersistence = createPersistence(documentId, doc, {
      keyPrefix: persistence?.keyPrefix,
    });
    persistenceRef.current = localPersistence;

    localPersistence.on("synced", () => {
      setIsLocalSynced(true);
    });

    // Set up Hocuspocus provider only when cloud sync is enabled
    if (cloudEnabled) {
      const prov = createProvider({
        documentId,
        ydoc: doc,
        url,
        getToken,
        documentName,
      });
      providerRef.current = prov;
      setProvider(prov);

      prov.on("synced", () => {
        setIsRemoteSynced(true);
      });

      prov.on("disconnect", () => {
        setIsRemoteSynced(false);
        updatePeerCount(0);
      });

      prov.on(
        "awarenessChange",
        ({ states }: { states: Map<number, unknown> }) => {
          // Subtract 1 for the local client's own awareness state
          updatePeerCount(Math.max(0, states.size - 1));
        },
      );
    }

    return cleanup;
  }, [
    documentId,
    url,
    getToken,
    documentName,
    cloudEnabled,
    persistence?.keyPrefix,
    cleanup,
    updatePeerCount,
  ]);

  return {
    ydoc,
    provider,
    isLocalSynced,
    isRemoteSynced,
    isSyncing: cloudEnabled && !isRemoteSynced && isLocalSynced,
    peerCount,
  };
};

export default useCollaboration;
